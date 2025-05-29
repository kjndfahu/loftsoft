"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { ProductEditModal } from "./product-edit-modal"
import { useRouter } from "next/navigation"

interface EditProductButtonProps {
    productId: number
}

export function EditProductButton({ productId }: EditProductButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [product, setProduct] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleEditClick = async () => {
        try {
            setIsLoading(true)
            // Fetch the product data
            const response = await fetch(`/api/products/${productId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch product")
            }

            const data = await response.json()
            setProduct(data.product)
            setIsModalOpen(true)
        } catch (error) {
            console.error("Error fetching product:", error)
            alert("Не удалось загрузить данные товара")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={handleEditClick}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DBDEEF] rounded-full hover:bg-gray-50 transition-colors"
            >
                <Edit size={16} />
                <span>{isLoading ? "Загрузка..." : "Редактировать"}</span>
            </button>

            {isModalOpen && product && (
                <ProductEditModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    )
}
