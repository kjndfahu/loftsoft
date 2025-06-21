// popular-product-modal.tsx
"use client"

import { CrossLogo, SearchLogo } from "@/shared/icons"
import { type FC, useState, useEffect } from "react"
import Image from "next/image"
import { searchProductsAndCategories } from "@/enteties/product/product"
import { addPopularProduct, updatePopularProduct } from "@/enteties/popular-products/popular-products"

interface Props {
    setIsClicked: (arg: boolean) => void
    productId?: number
    product?: Product
    onProductChange?: () => void
}

interface Product {
    id: number
    name: string
    price: string
    photos: string[] // Changed from photo: string
    category?: {
        id: number
        title: string
    }
}

export const PopularProductModal: FC<Props> = ({ setIsClicked, productId, product, onProductChange }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(product || null)
    const [isSearching, setIsSearching] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.trim().length > 0) {
                setIsSearching(true)
                const result = await searchProductsAndCategories(searchQuery)
                if (result.success) {
                    const mappedProducts: Product[] = (result.products || []).map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        price: p.pricesByDuration[0]?.price?.regular || "0",
                        photos: p.photos || [], // Use photos array
                        category: p.category,
                    }));
                    setSearchResults(mappedProducts)
                }
                setIsSearching(false)
            } else {
                setSearchResults([])
            }
        }

        const debounceTimer = setTimeout(fetchSearchResults, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product)
        setSearchQuery("")
        setSearchResults([])
    }

    const handleSubmit = async () => {
        if (!selectedProduct) return

        try {
            setIsSubmitting(true)
            setError(null)

            let result
            if (productId) {
                result = await updatePopularProduct(productId, selectedProduct.id)
            } else {
                result = await addPopularProduct(selectedProduct.id)
            }

            if (result.success) {
                setIsClicked(false)
                onProductChange?.()
            } else {
                setError(result.error || "Failed to save popular product")
            }
        } catch (error) {
            console.error("Error saving popular product:", error)
            setError("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div onClick={e => e.stopPropagation()} className="flex flex-col w-[500px] bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-[40px]">
                <h3 className="text-[22px] font-bold text-[#161616]">
                    {productId ? "Изменить товар" : "Выбрать товар"}
                </h3>
                <button type="button" onClick={() => setIsClicked(false)} className="text-black">
                    <CrossLogo />
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <div className="flex items-center justify-between w-full border-[1px] border-[#DBDEEF] text-[16px] rounded-full py-3 md:px-6 px-3 relative z-10">
                        <input
                            placeholder="Искать тут.."
                            className="text-[#4E4F56] w-full outline-0"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <SearchLogo />
                    </div>

                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-[#DBDEEF] rounded-lg mt-1 shadow-lg z-20 max-h-[300px] overflow-y-auto">
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center text-black gap-2 py-2 px-3 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <div className="w-10 h-10 flex-shrink-0 relative overflow-hidden rounded-sm">
                                        <Image src={product.photos[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.category?.title || "Категория"}</p>
                                        <p className="text-xs font-semibold">{product.price} ₽</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isSearching && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-[#DBDEEF] rounded-lg mt-1 shadow-lg z-20 p-4 text-center">
                            Поиск...
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <div
                        className={`border-[1px] ${selectedProduct ? "border-solid" : "border-dashed"} border-[#DBDEEF] rounded-[16px] h-[350px] w-[250px] relative overflow-hidden`}
                    >
                        {selectedProduct && (
                            <Image
                                src={selectedProduct.photos[0] || "/placeholder.svg"}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="flex flex-col text-black gap-2">
                        <h2>Название: {selectedProduct?.name || ""}</h2>
                        <h2>Категория: {selectedProduct?.category?.title || ""}</h2>
                        <h2>Цена: {selectedProduct?.price || ""} ₽</h2>
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                <button
                    onClick={handleSubmit}
                    disabled={!selectedProduct || isSubmitting}
                    className={`text-white text-[16px] font-semibold ${
                        selectedProduct && !isSubmitting ? "bg-[#5069E8]" : "bg-gray-400"
                    } w-full h-[42px] rounded-full border-[1px] border-[#DBDEEF] relative`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Сохранение...
                        </span>
                    ) : (
                        "Готово"
                    )}
                </button>
            </div>
        </div>
    )
}