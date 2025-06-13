"use client"

import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"
import { useState } from "react"

type PurchaseBlockProps = {
    id?: string
    name?: string
    newPrice: string
    oldPrice?: string
    photos: string[] // Updated to array
    type: string[] // Subscription types
    licenseType: string[] // Selected license term
    deviceCounts: number[] // Selected device count
}

export const PurchaseBlock = ({ id, name, newPrice, oldPrice, photos, type, licenseType, deviceCounts }: PurchaseBlockProps) => {
    const [selectedType, setSelectedType] = useState<string>(type[0] || "KEY")

    return (
        <div className="flex md:w-[27%] sm:w-[500px] w-full flex-col gap-[10px]">
            <PriceBlock
                id={id}
                name={name}
                price={newPrice}
                oldPrice={oldPrice}
                photos={photos} // Pass photos array
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