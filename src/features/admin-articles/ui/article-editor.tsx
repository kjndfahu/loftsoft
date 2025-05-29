"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ImageIcon,
    Video,
    Quote,
    LinkIcon,
    ShoppingBag,
    Copy,
    Trash2,
    Plus,
    Save,
    ArrowLeft,
    ChevronDown,
    List,
} from "lucide-react"
import Image from "next/image"
import { createArticle, uploadArticleMedia, getArticles } from "@/enteties/articles/article"
import { getAllProducts } from "@/enteties/product/product"

type ContentBlockType = "text" | "image" | "video" | "quote" | "link" | "product" | "relatedArticle" | "tableOfContents"

interface ContentBlock {
    id: string
    type: ContentBlockType
    content: any
}

interface TableOfContentsSection {
    id: string
    title: string
    content: string
}

interface TableOfContentsBlock {
    sections: TableOfContentsSection[]
}

interface SelectOption {
    value: string
    label: string
}

interface CustomSelectProps {
    options: SelectOption[]
    value: string
    onChange: (value: string) => void
    placeholder: string
}

interface Article {
    id: number
    title: string
    photo: string | null
    text: string
    createdAt: string
}

const CustomSelect = ({ options, value, onChange, placeholder }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const selectedOption = options.find((option) => option.value === value)

    return (
        <div className="relative" ref={selectRef}>
            <div
                className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`${!selectedOption ? "text-gray-500" : ""}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export const ArticleEditor = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [mainImageFile, setMainImageFile] = useState<File | null>(null)
    const [blocks, setBlocks] = useState<ContentBlock[]>([{ id: "1", type: "text", content: "" }])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showProductSelect, setShowProductSelect] = useState(false)
    const [isHoveringMainImage, setIsHoveringMainImage] = useState(false)
    const mainImageInputRef = useRef<HTMLInputElement>(null)

    // Cloudinary configuration
    const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    // Fetch products and articles on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productResult = await getAllProducts()
                if (productResult.success) {
                    setProducts(productResult.products)
                } else {
                    console.error("Failed to fetch products:", productResult.error)
                }

                // Fetch articles
                const articleResult = await getArticles()
                if (articleResult.success) {
                    setArticles(articleResult.articles)
                } else {
                    console.error("Failed to fetch articles:", productResult.error)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchData()
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

    // Add a new content block
    const addBlock = (type: ContentBlockType, content?: any) => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content:
                type === "text"
                    ? ""
                    : type === "quote"
                        ? { text: "", author: "" }
                        : type === "tableOfContents"
                            ? { sections: [{ id: Date.now().toString(), title: "", content: "" }] }
                            : type === "product" && content
                                ? content
                                : type === "image" || type === "video"
                                    ? { file: null, url: "", caption: "" }
                                    : null,
        }
        setBlocks([...blocks, newBlock])
        setShowProductSelect(false)
    }

    // Remove a content block
    const removeBlock = (id: string) => {
        setBlocks(blocks.filter((block) => block.id !== id))
    }

    // Update a content block
    const updateBlock = (id: string, content: any) => {
        setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)))
    }

    // Handle media upload for a block
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const blockIndex = blocks.findIndex((block) => block.id === blockId)
            const block = blocks[blockIndex]

            if (blockIndex !== -1 && (block.type === "image" || block.type === "video")) {
                try {
                    const formData = new FormData()
                    if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
                        throw new Error("Cloudinary configuration is missing")
                    }
                    formData.append("file", file)
                    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
                    formData.append("type", block.type)

                    const uploadResult = await uploadArticleMedia(formData)
                    if (uploadResult.success) {
                        const updatedBlocks = [...blocks]
                        updatedBlocks[blockIndex].content = {
                            file,
                            url: uploadResult.url,
                            caption: blocks[blockIndex].content?.caption || "",
                        }
                        setBlocks(updatedBlocks)
                    } else {
                        throw new Error(`Failed to upload ${block.type}: ${uploadResult.error}`)
                    }
                } catch (error) {
                    console.error(`Error uploading ${block.type}:`, error)
                    alert(`Failed to upload ${block.type}: ${error instanceof Error ? error.message : String(error)}`)
                }
            }
        }
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

            const processedBlocks = await Promise.all(
                blocks.map(async (block) => {
                    if (["image", "video"].includes(block.type) && block.content?.file) {
                        const formData = new FormData()
                        formData.append("file", block.content.file)
                        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
                        formData.append("type", block.type)

                        const uploadResult = await uploadArticleMedia(formData)
                        if (uploadResult.success) {
                            return {
                                ...block,
                                content: {
                                    url: uploadResult.url,
                                    caption: block.content.caption || "",
                                },
                            }
                        } else {
                            throw new Error(`Failed to upload ${block.type}: ${uploadResult.error}`)
                        }
                    }
                    return block
                })
            )

            const result = await createArticle({
                title,
                photo: mainImageUrl,
                content: JSON.stringify(processedBlocks),
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

    // Render the appropriate editor for each block type
    const renderBlockEditor = (block: ContentBlock) => {
        switch (block.type) {
            case "text":
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Введите текст..."
                        className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                )

            case "image":
                return (
                    <div className="space-y-4">
                        {block.content?.url ? (
                            <div className="relative h-64 w-full">
                                <Image
                                    src={block.content.url || "/placeholder.svg"}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Нажмите для загрузки изображения</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload(e, block.id)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {block.content?.url && (
                            <input
                                type="text"
                                placeholder="Подпись к изображению (опционально)"
                                value={block.content.caption || ""}
                                onChange={(e) =>
                                    updateBlock(block.id, {
                                        ...block.content,
                                        caption: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        )}
                    </div>
                )

            case "video":
                return (
                    <div className="space-y-4">
                        {block.content?.url ? (
                            <div className="relative h-64 w-full">
                                <video src={block.content.url} controls className="w-full h-full" />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                <Video className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Нажмите для загрузки видео</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleMediaUpload(e, block.id)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {block.content?.url && (
                            <input
                                type="text"
                                placeholder="Подпись к видео (опционально)"
                                value={block.content.caption || ""}
                                onChange={(e) =>
                                    updateBlock(block.id, {
                                        ...block.content,
                                        caption: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        )}
                    </div>
                )

            case "quote":
                return (
                    <div className="space-y-4">
                        <textarea
                            value={block.content?.text || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                            placeholder="Введите цитату..."
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <input
                            type="text"
                            value={block.content?.author || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, author: e.target.value })}
                            placeholder="Автор цитаты"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )

            case "link":
                return (
                    <div className="space-y-4">
                        <input
                            type="url"
                            value={block.content?.url || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                            placeholder="URL ссылки"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            value={block.content?.title || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                            placeholder="Название ссылки (опционально)"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            value={block.content?.description || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, description: e.target.value })}
                            placeholder="Описание ссылки (опционально)"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )

            case "product":
                return (
                    <div className="space-y-4">
                        <CustomSelect
                            options={products.map((product) => ({ value: product.id.toString(), label: product.name }))}
                            value={block.content?.id?.toString() || ""}
                            onChange={(value) => {
                                const product = products.find((p) => p.id.toString() === value)
                                updateBlock(block.id, product)
                            }}
                            placeholder="Выберите товар"
                        />
                        {block.content && (
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    {block.content.photo && (
                                        <div className="relative h-16 w-16">
                                            <Image
                                                src={block.content.photo || "/placeholder.svg"}
                                                alt={block.content.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium">{block.content.name}</h4>
                                        <p className="text-sm text-gray-500">{block.content.price}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )

            case "relatedArticle":
                return (
                    <div className="space-y-4">
                        <CustomSelect
                            options={articles.map((article) => ({ value: article.id.toString(), label: article.title }))}
                            value={block.content?.id?.toString() || ""}
                            onChange={(value) => {
                                const article = articles.find((a) => a.id.toString() === value)
                                updateBlock(block.id, article)
                            }}
                            placeholder="Выберите статью"
                        />
                        {block.content && (
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    {block.content.photo && (
                                        <div className="relative h-16 w-16">
                                            <Image
                                                src={block.content.photo || "/placeholder.svg"}
                                                alt={block.content.title}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium">{block.content.title}</h4>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )

            case "tableOfContents":
                return (
                    <div className="space-y-4">
                        <div className="mb-4">
                            <h4 className="font-medium mb-2">Предпросмотр оглавления</h4>
                            <div className="pl-4 border-l-2 border-gray-300">
                                {(block.content?.sections || []).map((section: TableOfContentsSection, idx: number) => (
                                    <div key={section.id} className="text-sm py-1">
                                        {section.title || "Без заголовка"}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {(block.content?.sections || []).map((section: TableOfContentsSection, idx: number) => (
                            <div key={section.id} className="border p-4 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Раздел {idx + 1}</h4>
                                    <div className="flex gap-2">
                                        {idx > 0 && (
                                            <button
                                                type="button"
                                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                onClick={() => {
                                                    const newSections = [...block.content.sections]
                                                    newSections.splice(idx, 1)
                                                    updateBlock(block.id, { ...block.content, sections: newSections })
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={section.title || ""}
                                        onChange={(e) => {
                                            const newSections = [...block.content.sections]
                                            newSections[idx] = { ...section, title: e.target.value }
                                            updateBlock(block.id, { ...block.content, sections: newSections })
                                        }}
                                        placeholder="Заголовок раздела"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    <textarea
                                        value={section.content || ""}
                                        onChange={(e) => {
                                            const newSections = [...block.content.sections]
                                            newSections[idx] = { ...section, content: e.target.value }
                                            updateBlock(block.id, { ...block.content, sections: newSections })
                                        }}
                                        placeholder="Содержание раздела..."
                                        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                const newSections = [...(block.content?.sections || [])]
                                newSections.push({ id: Date.now().toString(), title: "", content: "" })
                                updateBlock(block.id, { ...block.content, sections: newSections })
                            }}
                            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        >
                            <Plus size={16} /> Добавить раздел
                        </button>
                    </div>
                )

            default:
                return null
        }
    }

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
                        placeholder="Введите заголовок статьи"
                        required
                        className="w-full p-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Главное изображение</label>
                    <div
                        className={`relative h-[250px] rounded-[16px] overflow-hidden ${
                            mainImage ? "" : "bg-[#B9BCCB]"
                        } cursor-pointer transition-all duration-200 ${
                            isHoveringMainImage && !mainImage ? "bg-[#A4A8BA]" : ""
                        } flex items-center justify-center`}
                        onClick={handleMainImageClick}
                        onMouseEnter={() => setIsHoveringMainImage(true)}
                        onMouseLeave={() => setIsHoveringMainImage(false)}
                    >
                        {mainImage ? (
                            <>
                                <Image src={mainImage} alt="Main article image" fill style={{ objectFit: "cover" }} />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                    <div className="bg-white p-2 rounded-full opacity-0 hover:opacity-100 transition-all duration-200">
                                        <ImageIcon className="w-6 h-6 text-[#161616]" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-white">
                                <ImageIcon className="w-10 h-10 mb-2" />
                                <p className="text-sm font-medium">Нажмите, чтобы загрузить изображение</p>
                                <p className="text-xs opacity-70 mt-1">Рекомендуемый размер: 424x133px</p>
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

            <div className="space-y-8 text-black">
                <h2 className="text-xl font-semibold">Содержание статьи</h2>

                {blocks.map((block, index) => (
                    <div key={block.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Блок {index + 1}:</span>
                                <span className="text-sm text-gray-500">
                                    {block.type === "text"
                                        ? "Текст"
                                        : block.type === "image"
                                            ? "Изображение"
                                            : block.type === "video"
                                                ? "Видео"
                                                : block.type === "quote"
                                                    ? "Цитата"
                                                    : block.type === "link"
                                                        ? "Ссылка"
                                                        : block.type === "product"
                                                            ? "Товар"
                                                            : block.type === "tableOfContents"
                                                                ? "Текст с оглавлением"
                                                                : "Похожая статья"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => {
                                        const newBlock = { ...block, id: Date.now().toString() }
                                        setBlocks([...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)])
                                    }}
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    type="button"
                                    className={`p-1 text-gray-500 hover:text-gray-700 transition-colors ${blocks.length === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => removeBlock(block.id)}
                                    disabled={blocks.length === 1}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {renderBlockEditor(block)}
                    </div>
                ))}

                <div className="flex flex-wrap gap-2 pt-4">
                    <button
                        type="button"
                        onClick={() => addBlock("text")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Plus size={16} /> Текст
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("image")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ImageIcon size={16} /> Изображение
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("video")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Video size={16} /> Видео
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("quote")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Quote size={16} /> Цитата
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("link")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <LinkIcon size={16} /> Ссылка
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowProductSelect(true)}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ShoppingBag size={16} /> Товар
                    </button>
                    {showProductSelect && (
                        <div className="w-full mt-2">
                            <CustomSelect
                                options={products.map((product) => ({ value: product.id.toString(), label: product.name }))}
                                value=""
                                onChange={(value) => {
                                    const product = products.find((p) => p.id.toString() === value)
                                    if (product) {
                                        addBlock("product", product)
                                    }
                                }}
                                placeholder="Выберите товар"
                            />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => addBlock("relatedArticle")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Copy size={16} /> Похожая статья
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("tableOfContents")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <List size={16} /> Текст с оглавлением
                    </button>
                </div>
            </div>
        </form>
    )
}