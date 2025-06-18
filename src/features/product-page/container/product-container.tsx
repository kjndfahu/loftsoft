"use client"

import { ReviewStar } from "@/shared/icons"
import { ProductDescription } from "@/features/product-page/ui/product-description"
import ProductSpecifications from "@/features/product-page/ui/product-specifications"
import { Distributive } from "@/features/product-page/ui/distributive"
import { PurchaseBlock } from "@/features/product-page/ui/purchase-block"
import Image from "next/image"
import { useState } from "react"

interface ProductContainerProps {
    item: {
        id: number
        name: string
        pricesByDuration: { durationId: string; price: string }[]
        photos: string[]
        description?: string | null
        type: string[]
        licenseType: string[]
        deviceCounts: number[]
        characteristics: { id: number; title: string; value: string }[]
        distributives: { id: number; displayName: string; fileUrl: string }[]
        averageRating: number
        reviews: { id: number; grade: number }[]
    }
}

const licenseTypeLabels: Record<string, string> = {
    PERPETUAL: "Бессрочно",
    ONE_MONTH: "1 м.",
    THREE_MONTHS: "3 м.",
    SIX_MONTHS: "6 м.",
    ONE_YEAR: "1 год",
    TWO_YEARS: "2 года",
    THREE_YEARS: "3 года",
    FOUR_YEARS: "4 года",
    FIVE_YEARS: "5 лет",
}

export const ProductContainer = ({ item }: ProductContainerProps) => {
    const [selectedLicenseType, setSelectedLicenseType] = useState<string>(item.licenseType[0] || "")
    const [selectedDeviceCount, setSelectedDeviceCount] = useState<number>(item.deviceCounts[0] || 1)

    // Find the price for the selected license type
    const selectedPrice = item.pricesByDuration.find(
        (price) => price.durationId === selectedLicenseType
    )?.price || item.pricesByDuration[0]?.price || "0"

    // Calculate star rating display
    const fullStars = Math.floor(item.averageRating)
    const hasHalfStar = item.averageRating % 1 >= 0.5
    const reviewCount = item.reviews.length

    return (
        <div className="flex flex-col md:flex-row w-full md:gap-7 gap-4">
            <div style={{ aspectRatio: 384 / 537 }} className="self-center aspect-384/537 relative bg-gray-400 md:w-[30%] sm:w-[33%] sm:w-[400px] w-[236px] rounded-[20px]">
                <Image
                    src={item.photos[0] || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-[20px]"
                />
            </div>
            <div className="flex md:w-[37%] w-full flex-col md:gap-6 gap-4">
                <div className="flex flex-col gap-[10px]">
                    <h3 className="md:text-[24px] text-[20px] font-semibold text-[#161616]">{item.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="md:text-[16px] text-[14px] text-[#FFAC33]">{item.averageRating.toFixed(1)}</span>
                        <div className="flex gap-[6px]">
                            {[...Array(5)].map((_, index) => (
                                <ReviewStar
                                    key={index}
                                    className="w-[14px] h-[14px]"
                                    color={index < fullStars || (index === fullStars && hasHalfStar) ? "#FFAC33" : "#CECDCC"}
                                />
                            ))}
                        </div>
                        <span className="text-[16px] text-[#6A6B75]">{reviewCount} отзыв{reviewCount !== 1 ? "ов" : ""}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="md:text-[14px] text-[13px] text-[#161616]">Количество устройств:</span>
                    <div className="flex flex-wrap gap-[10px]">
                        {item.deviceCounts.map((count) => (
                            <button
                                key={count}
                                onClick={() => setSelectedDeviceCount(count)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${
                                    selectedDeviceCount === count ? "border-[#5069E8]" : "border-[#DBDEEF]"
                                }`}
                            >
                                <span>{count} ПК</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="md:text-[14px] text-[13px] text-[#161616]">Срок лицензии:</span>
                    <div className="flex flex-wrap gap-[10px]">
                        {item.licenseType.map((licenseType) => (
                            <button
                                key={licenseType}
                                onClick={() => setSelectedLicenseType(licenseType)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${
                                    selectedLicenseType === licenseType ? "border-[#5069E8]" : "border-[#DBDEEF]"
                                }`}
                            >
                                <span>{licenseTypeLabels[licenseType]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <ProductDescription description={item.description || ""} />
                <ProductSpecifications characteristics={item.characteristics} />
                <Distributive distributives={item.distributives} />
            </div>
            <PurchaseBlock
                id={item.id.toString()}
                name={item.name}
                price={selectedPrice}
                photos={item.photos}
                type={item.type}
                licenseType={selectedLicenseType} // Pass as single string
                deviceCounts={[selectedDeviceCount]}
            />
        </div>
    )
}