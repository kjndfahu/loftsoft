// purchase-block.tsx
"use client"

import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"
import { useState } from "react"

interface PurchaseBlockProps {
    id?: string
    name?: string
    regularPrice: string
    discountedPrice: string
    photos: string[]
    type: string[]
    licenseType: string
    deviceCounts: number[]
    discountPercentage: number
    savings: string
}

export const PurchaseBlock = ({
                                  id,
                                  name,
                                  regularPrice,
                                  discountedPrice,
                                  photos,
                                  type,
                                  licenseType,
                                  deviceCounts,
                                  discountPercentage,
                                  savings,
                              }: PurchaseBlockProps) => {
    const [selectedType, setSelectedType] = useState<string>(type[0] || "KEY")

    return (
        <div className="flex md:w-[27%] w-full flex-col gap-[10px]">
            <PriceBlock
                id={id}
                name={name}
                regularPrice={regularPrice}
                discountedPrice={discountedPrice}
                photo={photos[0]}
                type={selectedType}
                licenseType={licenseType}
                deviceCount={deviceCounts[0] || 1}
                discountPercentage={discountPercentage}
                savings={savings}
            />
            <SubType
                availableTypes={type}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                licenseTypes={[]}
                selectedLicenseType={licenseType}
                setSelectedLicenseType={() => {}}
                deviceCounts={[]}
                selectedDeviceCount={deviceCounts[0] || 1}
                setSelectedDeviceCount={() => {}}
            />
            <PostBlock />
        </div>
    )
}