// product-container.tsx
import { ReviewStar } from "@/shared/icons"
// import { ProductOptions } from "@/features/product-page/ui/product-options"
import { ProductDescription } from "@/features/product-page/ui/product-description"
import ProductSpecifications from "@/features/product-page/ui/product-specifications"
import { Distributive } from "@/features/product-page/ui/distributive"
import { PurchaseBlock } from "@/features/product-page/ui/purchase-block"
import Image from "next/image"

type ProductContainerProps = {
    item: {
        id: number
        name: string
        price: string
        newPrice: string
        photo: string
        description?: string
        type: string[]
        licenseType: string[]
        deviceCounts: number[]
        characteristics: { title: string; value: string }[]
        distributives: { displayName: string; fileUrl: string }[]
    }
}

export const ProductContainer = ({ item }: ProductContainerProps) => {
    return (
        <div className="flex flex-col mds:flex-row w-full mdbvp:gap-7 gap-4">
            <div style={{ aspectRatio: 384 / 537 }} className="self-center aspect-384/537 relative bg-gray-400 mdbvp:w-[30%] mds:w-[33%] sml:w-[400px] sm:w-[300px] w-[236px] rounded-[20px]">
                {item.photo && (
                    <Image src={item.photo || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-[20px]" />
                )}
            </div>
            <div className="flex mdbvp:w-[37%] mds:w-[34%] w-full flex-col mdbvp:gap-6 gap-4">
                <div className="flex flex-col gap-[10px]">
                    <p className="text-[12px] text-[#737373]">Microsoft Partner</p>
                    <h3 className="mdbvp:text-[24px] text-[20px] font-semibold text-[#161616]">{item.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="mdbvp:text-[16px] text-[14px] text-[#FFAC33]">4.2</span>
                        <div className="flex gap-[6px]">
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33" />
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33" />
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33" />
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33" />
                            <ReviewStar className="w-[14px] h-[14px]" color="#CECDCC" />
                        </div>
                        <span className="text-[16px] text-[#CECDCC]">504 отзыва</span>
                    </div>
                </div>
                <ProductDescription description={item.description || ""} />
                <ProductSpecifications characteristics={item.characteristics} />
                <Distributive distributives={item.distributives} />
            </div>
            <PurchaseBlock
                id={item.id}
                name={item.name}
                newPrice={item.newPrice}
                oldPrice={item.price || undefined}
                photo={item.photo || undefined}
                type={item.type}
                licenseType={item.licenseType}
                deviceCounts={item.deviceCounts}
            />
        </div>
    )
}