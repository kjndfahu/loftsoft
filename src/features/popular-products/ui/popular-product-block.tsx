"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Modal } from "@/shared/modal"
import { PopularProductModal } from "@/features/popular-products/ui/popular-product-modal"
import { useRouter } from "next/navigation"
import { removePopularProduct } from "@/enteties/popular-products/popular-products"
import { Product } from "@/features/home/ui/items-grid"

interface PopularProductProps {
    product?: {
        id: number
        item: Product
    }
    isEditable?: boolean
    onProductChange?: () => void
}

export const PopularProductBlock = ({ product, isEditable = true, onProductChange }: PopularProductProps) => {
    const [isClicked, setIsClicked] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleRemove = () => {
        if (!product) return

        if (confirm("Вы уверены, что хотите удалить этот товар из популярных?")) {
            startTransition(async () => {
                const result = await removePopularProduct(product.id)
                if (result.success) {
                    onProductChange?.()
                    router.refresh()
                } else {
                    console.error("Failed to remove popular product:", result.error)
                }
            })
        }
    }

    const formatPrice = (priceData: { regular: string; discounted: string } | undefined) => {
        if (!priceData) return "Цена не указана"

        const regularPrice = Number.parseFloat(priceData.regular)
        const discountedPrice = priceData.discounted ? Number.parseFloat(priceData.discounted) : null

        if (discountedPrice && discountedPrice < regularPrice) {
            return (
                <span>
                    <span className="text-[#161616] line-through">
                        {new Intl.NumberFormat("ru-RU").format(regularPrice)} ₽
                    </span>{" "}
                    <span className="text-[#5069E8] font-semibold">
                        {new Intl.NumberFormat("ru-RU").format(discountedPrice)} ₽
                    </span>
                </span>
            )
        }
        return (
            <span className="text-[#161616]">
                {new Intl.NumberFormat("ru-RU").format(regularPrice)} ₽
            </span>
        )
    }

    if (product) {
        return (
            <div className="flex flex-col w-full border-[1px] border-[#DBDEEF] rounded-[16px] overflow-hidden">
                <div className="relative w-full h-[150px]">
                    <Image
                        src={product.item.photos[0] || "/placeholder.svg"}
                        alt={product.item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            console.error(`Failed to load image for ${product.item.name}: ${product.item.photos[0]}`)
                            e.currentTarget.src = "/placeholder.svg"
                        }}
                    />
                </div>
                <div className="p-3 text-black">
                    <p className="text-sm font-medium">{product.item.name}</p>
                    <p className="text-xs text-gray-500">{product.item.category?.title || "Категория"}</p>
                    <p className="text-xs font-semibold mt-1">
                        {formatPrice(product.item.pricesByDuration[0]?.price)}
                    </p>
                </div>
                {isEditable && (
                    <div className="flex border-t border-[#DBDEEF]">
                        <button
                            onClick={() => setIsClicked(true)}
                            className="flex-1 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Изменить
                        </button>
                        <button
                            onClick={handleRemove}
                            disabled={isPending}
                            className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-l border-[#DBDEEF]"
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
        >
            <div className="flex items-center justify-center border-[1px] text-gray-500 border-[#DBDEEF] w-[50px] h-[50px] rounded-full">
                +
            </div>
            {isClicked && <Modal form={<PopularProductModal setIsClicked={setIsClicked} onProductChange={onProductChange} />} />}
        </div>
    )
}