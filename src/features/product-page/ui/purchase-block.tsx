"use client"

import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"
import { useState } from "react"

interface PurchaseBlockProps {
    id?: string
    name?: string
    price: string
    photos: string[]
    type: string[]
    licenseType: string // Changed to single string
    deviceCounts: number[]
}

export const PurchaseBlock = ({ id, name, price, photos, type, licenseType, deviceCounts }: PurchaseBlockProps) => {
    const [selectedType, setSelectedType] = useState<string>(type[0] || "KEY")

    return (
        <div className="flex md:w-[27%] sm:w-[500px] w-full flex-col gap-[10px]">
            <PriceBlock
                id={id}
                name={name}
                price={price}
                photo={photos[0]}
                type={selectedType}
                licenseType={licenseType}
                deviceCount={deviceCounts[0] || 1}
            />
            <SubType
                availableTypes={type}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                licenseTypes={[]} // Empty to prevent license type selection here
                selectedLicenseType={licenseType}
                setSelectedLicenseType={() => {}} // No-op to prevent changes
                deviceCounts={[]}
                selectedDeviceCount={deviceCounts[0] || 1}
                setSelectedDeviceCount={() => {}} // No-op to prevent changes
            />
            <PostBlock />
        </div>
    )
}