import {ReviewUserInfo} from "@/features/product-page/ui/review-user-info";
import {ReviewInfo} from "@/features/product-page/ui/review-info";

export const Review = () => {
    return (
        <div className="flex w-full flex-1 gap-[100px] justify-between rounded-[16px] p-6 border-[1px] border-[#E9EBF6]">
           <ReviewUserInfo/>
           <ReviewInfo/>
        </div>
    )
}