import { SubType } from "@/features/product-page/ui/sub-type"
import { PriceBlock } from "@/features/product-page/ui/price-block"
import { PostBlock } from "@/features/product-page/ui/post-block"
import type { Item } from "@prisma/client"

type PurchaseBlockProps = {
    id?: string
    name?: string
    price: string
    oldPrice?: string
    photo?: string
    type?: Item["type"]
    licenseType?: Item["licenseType"]
}

export const PurchaseBlock = ({ id, name, price, oldPrice, photo, type, licenseType }: PurchaseBlockProps) => {
    return (
        <div className="flex w-[33%] flex-col gap-[10px]">
            <PriceBlock
                id={id}
                name={name}
                price={price}
                oldPrice={oldPrice}
                photo={photo}
                type={type}
                licenseType={licenseType}
            />
            <SubType availableTypes={type || []} licenseType={licenseType} />
            <PostBlock />
        </div>
    )
}
