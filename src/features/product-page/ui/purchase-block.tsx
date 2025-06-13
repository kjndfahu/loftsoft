"use client"

import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"
import { useState } from "react"

interface PurchaseBlockProps {
    id?: string
    name?: string
    price: string // Selected price based on license type
    photos: string[] // Changed to photos array
    type: string[]
    licenseType: string[]
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
                photo={photos[0]} // Use first photo
                type={selectedType}
                licenseType={licenseType[0] || ""}
                deviceCount={deviceCounts[0] || 1}
            />
            <SubType
                availableTypes={type}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                licenseTypes={[]}
                selectedLicenseType={""}
                setSelectedLicenseType={() => {}}
                deviceCounts={[]}
                selectedDeviceCount={0}
                setSelectedDeviceCount={() => {}}
            />
            <PostBlock />
        </div>
    )
}