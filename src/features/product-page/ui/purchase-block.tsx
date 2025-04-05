import {SubType} from "@/features/product-page/ui/sub-type";
import {PriceBlock} from "@/features/product-page/ui/price-block";
import {PostBlock} from "@/features/product-page/ui/post-block";


export const PurchaseBlock = () => {
    return (
        <div className="flex w-[33%] flex-col gap-[10px]">
            <PriceBlock/>
            <SubType/>
            <PostBlock/>
        </div>
    )
}