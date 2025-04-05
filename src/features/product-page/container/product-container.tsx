import {ReviewStar} from "@/shared/icons";
import {ProductOptions} from "@/features/product-page/ui/product-options";
import {ProductDescription} from "@/features/product-page/ui/product-description";
import ProductSpecifications from "@/features/product-page/ui/product-specifications";
import {Distributive} from "@/features/product-page/ui/distributive";
import {PurchaseBlock} from "@/features/product-page/ui/purchase-block";

export const ProductContainer = () => {
    return (
        <div className="flex w-full gap-7">
            <div style={{aspectRatio: 384 / 537}} className="bg-gray-400 w-[30%] rounded-[20px] h-[537px]"/>
            <div className="flex w-[37%] flex-col gap-6">
                <div className="flex flex-col gap-[10px]">
                    <p className="text-[12px] text-[#737373]">Microsoft Partner</p>
                    <h3 className="text-[24px] text-[#161616]">Лицензионный ключ активации для Windows 11 Pro (Профессиональная)</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] text-[#FFAC33]">4.2</span>
                        <div className="flex gap-[6px]">
                            <ReviewStar  className="w-[14px] h-[14px]" color="#FFAC33"/>
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                            <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                            <ReviewStar className="w-[14px] h-[14px]" color="#CECDCC"/>
                        </div>
                        <span className="text-[16px] text-[#CECDCC]">504 отзыва</span>
                    </div>
                </div>
                <ProductOptions/>
                <ProductDescription/>
                <ProductSpecifications/>
                <Distributive/>
            </div>
            <PurchaseBlock/>
        </div>
    )
}