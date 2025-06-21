// popular-product-block.tsx
"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Modal } from "@/shared/modal"
import { PopularProductModal } from "@/features/popular-products/ui/popular-product-modal"
import { useRouter } from "next/navigation"
import { removePopularProduct } from "@/enteties/popular-products/popular-products"

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
    onProductChange?: () => void // Added to notify parent of changes
}

export const PopularProductBlock = ({ product, isEditable = true, onProductChange }: PopularProductProps) => {
    const [isClicked, setIsClicked] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleRemove = () => {
        if (!product) return

        if (confirm("Вы уверены, что хотите удалить этот товар из популярных?")) {
            startTransition(async () => {
                await removePopularProduct(product.id)
                onProductChange?.() // Trigger re-fetch
                router.refresh() // Fallback in case re-fetch fails
            })
        }
    }

    if (product) {
        return (
            <div className="flex flex-col w-full border-[1px] border-[#DBDEEF] rounded-[16px] overflow-hidden">
                <div className="relative w-full h-[150px]">
                    <Image src={product.item.photo || "/placeholder.svg"} alt={product.item.photo} fill className="object-cover" />
                </div>
                <div className="p-3 text-black">
                    <p className="text-sm font-medium">{product.item.name}</p>
                    <p className="text-xs text-gray-500">{product.item.category?.title || "Категория"}</p>
                    <p className="text-xs font-semibold mt-1">{product.item.price} ₽</p>
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