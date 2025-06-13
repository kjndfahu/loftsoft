"use client"

import { CrossLogo } from "@/shared/icons"
import Image from "next/image"

// Updated Product interface to match server-side
interface Product {
    id: number
    name: string
    pricesByDuration: { durationId: string; price: string }[]
    photos: string[]
    description?: string | null
    categoryId?: number | null
    type: string[]
    licenseType: string[] // Changed to string[]
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string }[]
    category?: { id: string; title: string }
    averageRating: number
    purchaseCount: number
}

interface ProductDetailModalProps {
    product: Product
    isOpen: boolean
    onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    if (!isOpen) return null

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("ru-RU").format(Number(price)) + " ₽"
    }

    const getLicenseTypeText = (types: string[]) => {
        const licenseMap: Record<string, string> = {
            PERPETUAL: "Бессрочно",
            ONE_MONTH: "1 месяц",
            THREE_MONTHS: "3 месяца",
            SIX_MONTHS: "6 месяцев",
            ONE_YEAR: "1 год",
        }
        return types.map((type) => licenseMap[type] || type).join(", ")
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 text-black">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <button onClick={onClose}>
                            <CrossLogo className="w-6 h-6 cursor-pointer" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="relative h-[300px] w-full rounded-[16px] overflow-hidden mb-4">
                                <Image
                                    src={product.photos[0] || "/placeholder.svg"} // Use first photo
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div className="text-2xl font-bold mb-4">
                                {product.pricesByDuration[0]?.price ? formatPrice(product.pricesByDuration[0].price) : "Цена не указана"}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="border border-[#DBDEEF] rounded-[16px] p-3">
                                    <div className="text-sm text-gray-500">Категория</div>
                                    <div className="font-medium">{product.category?.title || "Не указана"}</div>
                                </div>
                                <div className="border border-[#DBDEEF] rounded-[16px] p-3">
                                    <div className="text-sm text-gray-500">Тип</div>
                                    <div className="font-medium">{getSubscriptionTypeText(product.type)}</div>
                                </div>
                                <div className="border border-[#DBDEEF] rounded-[16px] p-3">
                                    <div className="text-sm text-gray-500">Срок лицензии</div>
                                    <div className="font-medium">{getLicenseTypeText(product.licenseType)}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Описание</h3>
                                <p className="text-gray-700 whitespace-pre-line">{product.description || "Описание отсутствует"}</p>
                            </div>

                            {product.characteristics && product.characteristics.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Характеристики</h3>
                                    <div className="border border-[#DBDEEF] rounded-[16px] overflow-hidden">
                                        {product.characteristics.map((char, index) => (
                                            <div
                                                key={char.id}
                                                className={`flex justify-between p-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                            >
                                                <span className="font-medium">{char.title}</span>
                                                <span>{char.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.distributives && product.distributives.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Дистрибутивы</h3>
                                    <div className="border border-[#DBDEEF] rounded-[16px] overflow-hidden">
                                        {product.distributives.map((dist, index) => (
                                            <div key={dist.id} className={`p-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                                {dist.displayName}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}