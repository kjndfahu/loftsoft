"use client"

import { ReviewStar } from "@/shared/icons"
import { ProductDescription } from "@/features/product-page/ui/product-description"
import ProductSpecifications from "@/features/product-page/ui/product-specifications"
import { Distributive } from "@/features/product-page/ui/distributive"
import { PurchaseBlock } from "@/features/product-page/ui/purchase-block"
import Image from "next/image"
import { useState } from "react"

type ProductContainerProps = {
    item: {
        id: number
        name: string
        price: string
        newPrice: string
        photos: string[] // Updated to array of photos
        description?: string
        type: string[] // Subscription types
        licenseType: string[] // License terms
        deviceCounts: number[] // Device counts
        characteristics: { title: string; value: string }[]
        distributives: { displayName: string; fileUrl: string }[]
        averageRating: number // Added average rating
        reviewCount: number // Added review count
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
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0) // Track selected photo index

    // Calculate star rating display
    const fullStars = Math.floor(item.averageRating)
    const hasHalfStar = item.averageRating % 1 >= 0.5

    // Get the current main photo
    const currentPhoto = item.photos[selectedPhotoIndex] || "/placeholder.svg"

    return (
        <div className="flex flex-col md:flex-row w-full md:gap-7 gap-4">
            <div className="flex md:flex-row flex-col md:gap-4 gap-2">
                {/* Thumbnails */}
                <div className="flex flex-col gap-2 md:w-[80px] w-full">
                    {item.photos.map((photo, index) => (
                        <div
                            key={index}
                            className={`relative w-full aspect-[384/537] bg-gray-400 rounded-[10px] cursor-pointer overflow-hidden ${
                                selectedPhotoIndex === index ? "border-2 border-[#5069E8]" : ""
                            }`}
                            onClick={() => setSelectedPhotoIndex(index)}
                        >
                            <Image
                                src={photo || "/placeholder.svg"}
                                alt={`${item.name} thumbnail ${index + 1}`}
                                fill
                                className="object-cover rounded-[10px]"
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {item.photos.length === 0 && (
                        <div className="relative w-full aspect-[384/537] bg-gray-400 rounded-[10px]">
                            <Image
                                src="/placeholder.svg"
                                alt={`${item.name} thumbnail`}
                                fill
                                className="object-cover rounded-[10px]"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>

                {/* Main Image */}
                <div style={{ aspectRatio: 384 / 537 }} className="self-center relative bg-gray-400 md:w-[30%] sm:w-[33%] sm:w-[400px] w-[236px] rounded-[20px]">
                    <Image
                        src={currentPhoto}
                        alt={item.name}
                        fill
                        className="object-cover rounded-[20px]"
                        loading="lazy"
                    />
                </div>
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
                        <span className="text-[16px] text-[#6A6B75]">{item.reviewCount} отзыв</span>
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
                newPrice={item.newPrice}
                oldPrice={item.price || undefined}
                photo={currentPhoto} // Pass the current main photo
                type={item.type}
                licenseType={[selectedLicenseType]}
                deviceCounts={[selectedDeviceCount]}
            />
        </div>
    )
}