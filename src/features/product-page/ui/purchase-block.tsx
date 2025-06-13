"use client"

import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"

interface PurchaseBlockProps {
    id?: string
    name?: string
    price: string
    photos: string[]
    type: string[]
    selectedType: string
    setSelectedType: (type: string) => void
    licenseType: string[]
    selectedLicenseType: string
    setSelectedLicenseType: (licenseType: string) => void
    deviceCounts: number[]
    selectedDeviceCount: number
    setSelectedDeviceCount: (count: number) => void
}

export const PurchaseBlock = ({
                                  id,
                                  name,
                                  price,
                                  photos,
                                  type,
                                  selectedType,
                                  setSelectedType,
                                  licenseType,
                                  selectedLicenseType,
                                  setSelectedLicenseType,
                                  deviceCounts,
                                  selectedDeviceCount,
                                  setSelectedDeviceCount,
                              }: PurchaseBlockProps) => {
    return (
        <div className="flex md:w-[27%] sm:w-[500px] w-full flex-col gap-[10px]">
            <PriceBlock
                id={id}
                name={name}
                price={price}
                photo={photos[0]}
                type={selectedType}
                licenseType={selectedLicenseType}
                deviceCount={selectedDeviceCount}
            />
            <SubType
                availableTypes={type}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                licenseTypes={licenseType}
                selectedLicenseType={selectedLicenseType}
                setSelectedLicenseType={setSelectedLicenseType}
                deviceCounts={deviceCounts}
                selectedDeviceCount={selectedDeviceCount}
                setSelectedDeviceCount={setSelectedDeviceCount}
            />
            <PostBlock />
        </div>
    )
}