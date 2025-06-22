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
        pricesByDuration: { durationId: string; price: { regular: string; discounted: string } }[]
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

const getDurationLabel = (durationId: string): string => {
    const years = parseInt(durationId.replace("years", ""))
    const lastDigit = years % 10
    const lastTwoDigits = years % 100
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${years} лет`
    if (lastDigit === 1) return `${years} год`
    if (lastDigit >= 2 && lastDigit <= 4) return `${years} года`
    return `${years} лет`
}

export const ProductContainer = ({ item }: ProductContainerProps) => {
    const [selectedDurationId, setSelectedDurationId] = useState<string>(item.pricesByDuration[0]?.durationId || "")
    const [selectedDeviceCount, setSelectedDeviceCount] = useState<number>(item.deviceCounts[0] || 1)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [fullScreenIndex, setFullScreenIndex] = useState(0)

    const selectedPriceObj = item.pricesByDuration.find((price) => price.durationId === selectedDurationId) || item.pricesByDuration[0]
    const regularPrice = selectedPriceObj?.price.regular || "0"
    const discountedPrice = selectedPriceObj?.price.discounted || regularPrice
    const discountPercentage = regularPrice > 0 ? Math.round(((parseFloat(regularPrice) - parseFloat(discountedPrice)) / parseFloat(regularPrice)) * 100) : 0
    const savings = regularPrice > discountedPrice ? (parseFloat(regularPrice) - parseFloat(discountedPrice)).toFixed(0) : "0"

    const fullStars = Math.floor(item.averageRating)
    const hasHalfStar = item.averageRating % 1 >= 0.5
    const reviewCount = item.reviews.length

    const handleSlideChange = (index: number) => {
        setActiveSlide(index)
    }

    const openFullScreen = (index: number) => {
        setFullScreenIndex(index)
        setIsFullScreen(true)
    }

    const closeFullScreen = () => {
        setIsFullScreen(false)
    }

    const nextImage = () => {
        setFullScreenIndex((prev) => (prev + 1) % item.photos.length)
    }

    const prevImage = () => {
        setFullScreenIndex((prev) => (prev - 1 + item.photos.length) % item.photos.length)
    }

    return (
        <div className="flex flex-col md:flex-row w-full md:gap-7 gap-4">
            {/* Mobile Slider */}
            <div className="md:hidden w-full">
                {item.photos.length > 0 ? (
                    <>
                        <div className="relative mds:max-w-[540px] sml:max-w-[340px] max-w-[236px]" style={{ aspectRatio: 384 / 537 }}>
                            <div className="absolute inset-0">
                                <Image
                                    src={item.photos[activeSlide] || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded-[20px]"
                                    onError={() => console.error(`Failed to load image: ${item.photos[activeSlide] || "/placeholder.svg"}`)}
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-[20px]"></div>
                        </div>
                        <div className="flex justify-center gap-2 mt-2">
                            {item.photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSlideChange(index)}
                                    className={`w-2 h-2 rounded-full ${activeSlide === index ? "bg-[#5069E8]" : "bg-gray-300"}`}
                                ></button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="relative mds:max-w-[540px] sml:max-w-[340px] max-w-[236px]" style={{ aspectRatio: 384 / 537 }}>
                        <Image
                            src="/placeholder.svg"
                            alt="Placeholder"
                            fill
                            className="object-cover rounded-[20px]"
                            onError={() => console.error("Failed to load placeholder image")}
                        />
                    </div>
                )}
            </div>

            {/* Desktop Thumbnail Layout */}
            <div className="hidden md:flex h-[536px] w-[480px] flex-row gap-4">
                {item.photos.length > 1 && (
                    <div className="flex flex-col gap-2">
                        {item.photos.slice(1).map((photo, index) => (
                            <div
                                key={index}
                                style={{ aspectRatio: 1 / 1 }}
                                className="relative bg-gray-400 w-[76px] h-[76px] rounded-[8px] overflow-hidden cursor-pointer"
                                onClick={() => openFullScreen(index + 1)} // Open full screen on thumbnail click
                            >
                                <Image
                                    src={photo || "/placeholder.svg"}
                                    alt={`${item.name} thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover rounded-[8px]"
                                    onError={() => console.error(`Failed to load thumbnail: ${photo || "/placeholder.svg"}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ aspectRatio: 384 / 537 }} className="relative bg-gray-400 rounded-[20px] overflow-hidden cursor-pointer" onClick={() => openFullScreen(0)}>
                    <Image
                        src={item.photos[0] || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-[20px]"
                        onError={() => console.error(`Failed to load main image: ${item.photos[0] || "/placeholder.svg"}`)}
                    />
                </div>
            </div>

            {/* Full-Screen Slider */}
            {isFullScreen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[500]">
                    <button onClick={closeFullScreen} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
                    <button onClick={prevImage} className="absolute left-4 text-white text-4xl">&lt;</button>
                    <div className="relative" style={{ aspectRatio: 384 / 537, maxWidth: "90vw", maxHeight: "90vh" }}>
                        <Image
                            src={item.photos[fullScreenIndex] || "/placeholder.svg"}
                            alt={`${item.name} full screen`}
                            fill
                            className="object-contain"
                            onError={() => console.error(`Failed to load full-screen image: ${item.photos[fullScreenIndex] || "/placeholder.svg"}`)}
                        />
                    </div>
                    <button onClick={nextImage} className="absolute right-4 text-white text-4xl">&gt;</button>
                    <div className="flex justify-center gap-2 mt-4">
                        {item.photos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setFullScreenIndex(index)}
                                className={`w-3 h-3 rounded-full ${fullScreenIndex === index ? "bg-white" : "bg-gray-500"}`}
                            ></button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex md:w-[37%] w-full flex-col md:gap-6 gap-4">
                {/* Rest of your component remains unchanged */}
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
                {/* ... (other sections remain unchanged) */}
                <ProductDescription description={item.description || ""} />
                <ProductSpecifications characteristics={item.characteristics} />
                <Distributive distributives={item.distributives} />
            </div>
            <PurchaseBlock
                id={item.id.toString()}
                name={item.name}
                regularPrice={regularPrice}
                discountedPrice={discountedPrice}
                photos={item.photos}
                type={item.type}
                licenseType={selectedDurationId}
                deviceCounts={[selectedDeviceCount]}
                discountPercentage={discountPercentage}
                savings={savings}
            />
        </div>
    )
}