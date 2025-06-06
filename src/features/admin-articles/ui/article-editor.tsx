"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ImageIcon, Save, ArrowLeft } from "lucide-react"
import { createArticle, uploadArticleMedia } from "@/enteties/articles/article"
import { getAllProducts } from "@/enteties/product/product"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

// Quill modules configuration
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
    ],
    clipboard: {
        matchVisual: false,
    },
}

interface Article {
    id: number
    title: string
    photo: string | null
    text: string
    createdAt: string
}

interface Product {
    id: string
    name: string
    price: number | string
    photo: string
}

type ArticleContentBlock =
    | { type: "text"; content: string }
    | { type: "image"; content: string; caption?: string }
    | { type: "quote"; content: { text: string; author: string } }
    | { type: "section"; id: string; title: string; content: string }
    | { type: "link"; content: { url: string; title: string } }
    | { type: "product"; content: { id: string; name: string; price: number; photo: string } }
    | { type: "video"; content: { url: string; caption?: string } }
    | { type: "relatedArticle"; content: { id: number; title: string; photo: string } }

export const ArticleEditor = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [mainImageFile, setMainImageFile] = useState<File | null>(null)
    const [content, setContent] = useState("")
    const [selectedProducts, setSelectedProducts] = useState<ArticleContentBlock[]>([]) // New state for products
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isHoveringMainImage, setIsHoveringMainImage] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [showProductSelector, setShowProductSelector] = useState(false)
    const mainImageInputRef = useRef<HTMLInputElement>(null)
    const quillRef = useRef<any>(null)

    // Cloudinary configuration
    const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAllProducts()
                if (result.success && result.products) {
                    setProducts(result.products)
                } else {
                    console.error("Failed to fetch products:", result.error)
                }
            } catch (error) {
                console.error("Error fetching products:", error)
            }
        }
        fetchProducts()
    }, [])

    // Parse Quill HTML content into ArticleContentBlock array
    const parseQuillContentToBlocks = (html: string): ArticleContentBlock[] => {
        const blocks: ArticleContentBlock[] = []
        const parser = new DOMParser()
        const doc = parser.parseFromString(html || "<p></p>", "text/html")
        const elements = doc.body.childNodes

        elements.forEach((element, index) => {
            if (element.nodeName === "P") {
                const paragraphs = element.innerHTML.split(/<br\s*\/?>/i).filter((p) => p.trim())
                paragraphs.forEach((para) => {
                    if (para) {
                        const tempDiv = document.createElement("div")
                        tempDiv.innerHTML = para
                        const link = tempDiv.querySelector("a")
                        if (link) {
                            const url = link.getAttribute("href") || "#"
                            const title = link.textContent?.trim() || "Link"
                            blocks.push({ type: "link", content: { url, title } })
                        } else {
                            blocks.push({ type: "text", content: para })
                        }
                    }
                })
            } else if (element.nodeName === "BLOCKQUOTE") {
                const text = element.textContent?.trim()
                if (text) {
                    blocks.push({
                        type: "quote",
                        content: { text, author: "" },
                    })
                }
            } else if (element.nodeName === "IMG") {
                const src = (element as HTMLImageElement).src
                const alt = (element as HTMLImageElement).alt || ""
                if (src) {
                    blocks.push({ type: "image", content: src, caption: alt })
                }
            } else if (element.nodeName === "H1" || element.nodeName === "H2" || element.nodeName === "H3") {
                const title = element.textContent?.trim()
                if (title) {
                    blocks.push({
                        type: "section",
                        id: `section-${index}-${Math.random().toString(36).substr(2, 9)}`,
                        title,
                        content: "",
                    })
                }
            }
        })

        return blocks
    }

    // Handle clipboard paste for images
    useEffect(() => {
        const quill = quillRef.current?.getEditor()
        if (quill) {
            quill.root.addEventListener("paste", async (e: ClipboardEvent) => {
                const items = e.clipboardData?.items
                if (items) {
                    for (const item of items) {
                        if (item.type.includes("image")) {
                            e.preventDefault()
                            const file = item.getAsFile()
                            if (file) {
                                try {
                                    const formData = new FormData()
                                    if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
                                        throw new Error("Cloudinary configuration is missing")
                                    }
                                    formData.append("file", file)
                                    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

                                    const uploadResult = await uploadArticleMedia(formData)
                                    if (uploadResult.success) {
                                        const range = quill.getSelection(true)
                                        quill.insertEmbed(range.index, "image", uploadResult.url)
                                        quill.setSelection(range.index + 1)
                                    } else {
                                        throw new Error(`Failed to upload pasted image: ${uploadResult.error}`)
                                    }
                                } catch (error) {
                                    console.error("Error uploading pasted image:", error)
                                    alert(`Failed to upload pasted image: ${error instanceof Error ? error.message : String(error)}`)
                                }
                            }
                        }
                    }
                }
            })
        }
    }, [])

    // Handle main image upload
    const handleMainImageClick = () => {
        mainImageInputRef.current?.click()
    }

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setMainImageFile(file)
            try {
                const formData = new FormData()
                if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
                    throw new Error("Cloudinary configuration is missing")
                }
                formData.append("file", file)
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

                const uploadResult = await uploadArticleMedia(formData)
                if (uploadResult.success) {
                    setMainImage(uploadResult.url)
                } else {
                    throw new Error(`Failed to upload main image: ${uploadResult.error}`)
                }
            } catch (error) {
                console.error("Error uploading main image:", error)
                alert(`Failed to upload main image: ${error instanceof Error ? error.message : String(error)}`)
                setMainImage(null)
                setMainImageFile(null)
            }
        }
    }

    // Handle product selection
    const handleProductInsert = (product: Product) => {
        const productBlock: ArticleContentBlock = {
            type: "product",
            content: {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                photo: product.photo || "/placeholder.svg",
            },
        }
        setSelectedProducts((prev) => [...prev, productBlock])
        setShowProductSelector(false)
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setIsLoading(true)

        try {
            // Validate Cloudinary configuration
            if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
                throw new Error("Cloudinary configuration is missing")
            }

            let mainImageUrl = ""
            if (mainImageFile) {
                const formData = new FormData()
                formData.append("file", mainImageFile)
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

                const uploadResult = await uploadArticleMedia(formData)
                if (uploadResult.success) {
                    mainImageUrl = uploadResult.url
                } else {
                    throw new Error(`Failed to upload main image: ${uploadResult.error}`)
                }
            }

            // Combine Quill content and selected products
            const contentBlocks = parseQuillContentToBlocks(content)
            const allBlocks: ArticleContentBlock[] = [...contentBlocks, ...selectedProducts]
            const contentJson = JSON.stringify(allBlocks)

            const result = await createArticle({
                title,
                photo: mainImageUrl,
                content: contentJson,
            })

            if (result.success) {
                router.push("/admin-articles")
                router.refresh()
            } else {
                console.error("Failed to create article:", result.error)
                alert(`Failed to create article: ${result.error}`)
            }
        } catch (error) {
            console.error("Error creating article:", error)
            alert(`Error creating article: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
            setIsSubmitting(false)
            setIsLoading(false)
        }
    }

    // Handle image insertion via toolbar
    const handleImageInsert = async () => {
        const input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", "image/*")
        input.click()

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0]
                try {
                    const formData = new FormData()
                    if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
                        throw new Error("Cloudinary configuration is missing")
                    }
                    formData.append("file", file)
                    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

                    const uploadResult = await uploadArticleMedia(formData)
                    if (uploadResult.success) {
                        const quill = quillRef.current?.getEditor()
                        if (quill) {
                            const range = quill.getSelection(true)
                            quill.insertEmbed(range.index, "image", uploadResult.url)
                            quill.setSelection(range.index + 1)
                        } else {
                            console.error("Quill editor not initialized")
                        }
                    } else {
                        throw new Error(`Failed to upload image: ${uploadResult.error}`)
                    }
                } catch (error) {
                    console.error("Error uploading image:", error)
                    alert(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`)
                }
            }
        }
    }

    // Add custom image handler to Quill toolbar
    useEffect(() => {
        const quill = quillRef.current?.getEditor()
        if (quill) {
            const toolbar = quill.getModule("toolbar")
            toolbar.addHandler("image", handleImageInsert)
        }
    }, [])

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center text-black gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Назад
                </button>
                <button
                    type="button"
                    onClick={() => setShowProductSelector(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
                >
                    Добавить продукт
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !title}
                    className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ml-auto ${
                        isSubmitting || !title ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <p className="sml:flex hidden">{isLoading ? "Сохранение..." : "Сохранить статью"}</p>
                    <Save size={16} />
                </button>
            </div>

            <div className="space-y-4 text-black">
                <div>
                    <label className="block text-sm font-medium mb-1">Заголовок статьи</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Input article title"
                        required
                        className="w-full p-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Main image</label>
                    <div
                        className={`relative h-[250px] rounded-[40px] overflow-hidden ${
                            mainImage ? "" : "bg-[#B9BCCB]"
                        } cursor-pointer transition-all duration-200 ${
                            isHoveringMainImage ? "bg-[#A4A8BA]" : ""
                        } flex items-center justify-center`}
                        onClick={handleMainImageClick}
                        onMouseEnter={() => setIsHoveringMainImage(true)}
                        onMouseLeave={() => setIsHoveringMainImage(false)}
                    >
                        {mainImage ? (
                            <>
                                <Image src={mainImage} alt="Main article image" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                    <div className="bg-white p-2 rounded-full">
                                        <ImageIcon className="w-10 h-10 text-[#161616]" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-white">
                                <ImageIcon className="w-10 h-10 mb-2" />
                                <p className="text-sm font-medium">Click to upload an image</p>
                                <p className="text-xs opacity-70 mt-1">Recommended size: 424x426 pixels</p>
                            </div>
                        )}
                        <input
                            id="main-image-upload"
                            type="file"
                            accept="image/*"
                            ref={mainImageInputRef}
                            onChange={handleMainImageUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Display selected products */}
            {selectedProducts.length > 0 && (
                <div className="space-y-4 text-black">
                    <h2 className="text-xl font-semibold">Selected Products</h2>
                    <div className="space-y-2">
                        {selectedProducts.map((product, index) => (
                            <div
                                key={`selected-product-${index}`}
                                className="flex items-center justify-between p-4 border rounded-md"
                            >
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={product.content.photo}
                                        alt={product.content.name}
                                        width={50}
                                        height={50}
                                        className="object-cover rounded-md"
                                    />
                                    <div>
                                        <p className="font-medium">{product.content.name}</p>
                                        <p className="text-sm text-gray-500">{product.content.price} ₽</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedProducts((prev) => prev.filter((_, i) => i !== index))
                                    }
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4 text-black">
                <h2 className="text-xl font-semibold">Article Content</h2>
                <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    placeholder="Type article content..."
                    className="border border-gray-300 rounded-lg h-[500px]"
                />
            </div>

            {/* Product Selector Modal */}
            {showProductSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Select Products</h2>
                        {products.length > 0 ? (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleProductInsert(product)}
                                    >
                                        <Image
                                            src={product.photo || "default-image-url.jpg"}
                                            alt={product.name}
                                            width={50}
                                            height={50}
                                            className="object-cover rounded-md"
                                        />
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.price} </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No products found.</p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowProductSelector(false)}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </form>
    )
}