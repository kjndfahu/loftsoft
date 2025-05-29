"use client"

import Image from "next/image"
import { Edit, Eye } from "lucide-react"
import { useState } from "react"
import {ProductDetailModal} from "@/features/create-product/ui/product-detail-modal";


interface Product {
    id: number
    name: string
    price: string
    photo: string
    description: string
    categoryId: number
    type: string[]
    licenseType: string
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string }[]
    category: { id: string; title: string }
}

interface ProductCardProps {
    product: Product
    onEditClick: () => void
}

export function ProductCard({ product, onEditClick }: ProductCardProps) {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("ru-RU").format(Number(price)) + " ₽"
    }

    const getLicenseTypeText = (type: string) => {
        const licenseMap: Record<string, string> = {
            PERPETUAL: "Бессрочно",
            ONE_MONTH: "1 месяц",
            THREE_MONTHS: "3 месяца",
            SIX_MONTHS: "6 месяцев",
            ONE_YEAR: "1 год",
        }
        return licenseMap[type] || type
    }

    const getSubscriptionTypeText = (types: string[]) => {
        if (!types || types.length === 0) return ""

        const typeMap: Record<string, string> = {
            KEY: "Ключ",
            SUBSCRIPTION: "Подписка",
            ACCOUNT: "Аккаунт",
        }

        return types.map((type) => typeMap[type] || type).join(", ")
    }

    return (
        <>
            <div className="border border-[#DBDEEF] rounded-[16px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-[200px] w-full">
                    <Image src={product.photo || "/placeholder.svg"} alt={product.name} fill style={{ objectFit: "cover" }} />
                </div>

                <div className="p-4">
                    <div className="flex justify-between text-black items-start mb-2">
                        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                        <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                        <div className="flex justify-between mb-1">
                            <span>Категория:</span>
                            <span className="font-medium">{product.category?.title || "Не указана"}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Тип:</span>
                            <span className="font-medium">{getSubscriptionTypeText(product.type)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Срок:</span>
                            <span className="font-medium">{getLicenseTypeText(product.licenseType)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setIsDetailModalOpen(true)}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Eye size={16} />
                            <span>Просмотр</span>
                        </button>

                        <button
                            onClick={onEditClick}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Edit size={16} />
                            <span>Изменить</span>
                        </button>
                    </div>
                </div>
            </div>

            {isDetailModalOpen && (
                <ProductDetailModal product={product} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
            )}
        </>
    )
}
