import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"
import type { Item } from "@prisma/client"

type PurchaseBlockProps = {
    price: string
    type?: Item["type"]
    licenseType?: Item["licenseType"]
}

export const PurchaseBlock = ({ price, type, licenseType }: PurchaseBlockProps) => {
    return (
        <div className="flex w-[33%] flex-col gap-[10px]">
            <PriceBlock price={price} />
            <SubType availableTypes={type || []} licenseType={licenseType} />
            <PostBlock />
        </div>
    )
}
