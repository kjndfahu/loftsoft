// popular-product-modal.tsx
"use client"

import { CrossLogo, SearchLogo } from "@/shared/icons"
import { type FC, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { searchProductsAndCategories } from "@/enteties/product/product"
import { addPopularProduct, updatePopularProduct } from "@/enteties/popular-products/popular-products"
import { debounce } from "lodash"

// Проверка валидности base64-изображения
const isValidBase64Image = (src: string): boolean => {
    return src.startsWith("data:image/") && src.includes(";base64,");
}

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
    photo: string
    category?: {
        id: number
        title: string
    }
}

export const PopularProductModal: FC<Props> = ({
                                                   setIsClicked,
                                                   productId,
                                                   product,
                                                   onProductChange,
                                               }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        product || null
    )
    const [isSearching, setIsSearching] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Дебаунсинг поиска
    const fetchSearchResults = useCallback(
        debounce(async (query: string) => {
            if (query.trim().length > 0) {
                setIsSearching(true)
                try {
                    const result = await searchProductsAndCategories(query)
                    if (result.success) {
                        setSearchResults(result.products.slice(0, 10)) // Ограничение до 10 результатов
                    } else {
                        setError("Не удалось загрузить результаты поиска")
                    }
                } catch (error) {
                    setError("Ошибка при поиске товаров")
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSearchResults([])
            }
        }, 300),
        []
    )

    useEffect(() => {
        fetchSearchResults(searchQuery)
        return () => fetchSearchResults.cancel() // Отмена дебаунсинга при размонтировании
    }, [searchQuery, fetchSearchResults])

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

            const result = productId
                ? await updatePopularProduct(productId, selectedProduct.id)
                : await addPopularProduct(selectedProduct.id)

            if (result.success) {
                setIsClicked(false)
                onProductChange?.()
            } else {
                setError(result.error || "Не удалось сохранить товар")
            }
        } catch (error) {
            console.error("Error saving popular product:", error)
            setError("Произошла непредвиденная ошибка")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Безопасный источник изображения
    const getImageSrc = (photo: string) =>
        isValidBase64Image(photo) ? photo : "/placeholder.svg"

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-[500px] bg-white rounded-[16px] p-4"
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div className="flex items-center justify-between mb-[40px]">
                <h3 id="modal-title" className="text-[22px] font-bold text-[#161616]">
                    {productId ? "Изменить товар" : "Выбрать товар"}
                </h3>
                <button
                    type="button"
                    onClick={() => setIsClicked(false)}
                    className="text-black"
                    aria-label="Закрыть модальное окно"
                >
                    <CrossLogo />
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <div className="flex items-center justify-between w-full border-[1px] border-[#DBDEEF] text-[16px] rounded-full py-3 md:px-6 px-3 relative z-10">
                        <input
                            placeholder="Искать тут..."
                            className="text-[#4E4F56] w-full outline-0"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Поиск товаров"
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
                                    role="option"
                                    aria-selected={selectedProduct?.id === product.id}
                                >
                                    <div className="w-10 h-10 flex-shrink-0 relative overflow-hidden rounded-sm">
                                        <Image
                                            src={getImageSrc(product.photo)}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {product.category?.title || "Категория"}
                                        </p>
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
                        className={`border-[1px] ${
                            selectedProduct ? "border-solid" : "border-dashed"
                        } border-[#DBDEEF] rounded-[16px] h-[350px] w-[250px] relative overflow-hidden`}
                    >
                        {selectedProduct && (
                            <Image
                                src={getImageSrc(selectedProduct.photo)}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                                sizes="250px"
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
                    aria-label={productId ? "Сохранить изменения" : "Добавить товар"}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
              <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
              >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
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