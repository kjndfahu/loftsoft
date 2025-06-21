// popular-product-block.tsx
"use client"

import { useState, useTransition, memo } from "react"
import Image from "next/image"
import { Modal } from "@/shared/modal"
import { PopularProductModal } from "@/features/popular-products/ui/popular-product-modal"
import { useRouter } from "next/navigation"
import { removePopularProduct } from "@/enteties/popular-products/popular-products"

// Проверка валидности base64-изображения
const isValidBase64Image = (src: string): boolean => {
    return src.startsWith("data:image/") && src.includes(";base64,");
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

interface PopularProductProps {
    product?: {
        id: number
        item: Product
    }
    isEditable?: boolean
    onProductChange?: () => void
}

export const PopularProductBlock = memo(
    ({ product, isEditable = true, onProductChange }: PopularProductProps) => {
        const [isClicked, setIsClicked] = useState(false)
        const [isPending, startTransition] = useTransition()
        const router = useRouter()

        const handleRemove = () => {
            if (!product) return

            if (confirm("Вы уверены, что хотите удалить этот товар из популярных?")) {
                startTransition(async () => {
                    try {
                        await removePopularProduct(product.id)
                        onProductChange?.()
                        router.refresh()
                    } catch (error) {
                        console.error("Error removing popular product:", error)
                        alert("Ошибка при удалении товара")
                    }
                })
            }
        }

        // Безопасный источник изображения
        const getImageSrc = (photo: string) =>
            isValidBase64Image(photo) ? photo : "/placeholder.svg"

        if (product) {
            return (
                <div className="flex flex-col w-full border-[1px] border-[#DBDEEF] rounded-[16px] overflow-hidden">
                    <div className="relative w-full h-[150px]">
                        <Image
                            src={getImageSrc(product.item.photo)}
                            alt={product.item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 25vw"
                        />
                    </div>
                    <div className="p-3 text-black">
                        <p className="text-sm font-medium">{product.item.name}</p>
                        <p className="text-xs text-gray-500">
                            {product.item.category?.title || "Категория"}
                        </p>
                        <p className="text-xs font-semibold mt-1">{product.item.price} ₽</p>
                    </div>
                    {isEditable && (
                        <div className="flex border-t border-[#DBDEEF]">
                            <button
                                onClick={() => setIsClicked(true)}
                                className="flex-1 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                aria-label="Изменить товар"
                            >
                                Изменить
                            </button>
                            <button
                                onClick={handleRemove}
                                disabled={isPending}
                                className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-l border-[#DBDEEF] disabled:opacity-50"
                                aria-label="Удалить товар"
                            >
                                {isPending ? "Удаление..." : "Удалить"}
                            </button>
                        </div>
                    )}
                    {isClicked && (
                        <Modal
                            setModalOpen={setIsClicked}
                            form={
                                <PopularProductModal
                                    setIsClicked={setIsClicked}
                                    productId={product.id}
                                    product={product.item}
                                    onProductChange={onProductChange}
                                />
                            }
                        />
                    )}
                </div>
            )
        }

        return (
            <div
                onClick={() => setIsClicked(true)}
                className="flex items-center cursor-pointer justify-center w-full border-[1px] border-[#DBDEEF] rounded-[16px] h-[190px]"
                role="button"
                aria-label="Добавить новый популярный товар"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setIsClicked(true)}
            >
                <div className="flex items-center justify-center border-[1px] text-gray-500 border-[#DBDEEF] w-[50px] h-[50px] rounded-full">
                    +
                </div>
                {isClicked && (
                    <Modal
                        form={
                            <PopularProductModal
                                setIsClicked={setIsClicked}
                                onProductChange={onProductChange}
                            />
                        }
                    />
                )}
            </div>
        )
    }
)
PopularProductBlock.displayName = "PopularProductBlock"