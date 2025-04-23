import {ReviewUserInfo} from "@/features/product-page/ui/review-user-info";
import {ReviewInfo} from "@/features/product-page/ui/review-info";
import {TrashLogo} from "@/shared/icons";

export const AdminReview = () => {
    return (
        <div className="flex gap-5 items-start">
            <div
                className="flex w-full flex-1 gap-[100px] justify-between rounded-[16px] p-6 border-[1px] border-[#E9EBF6]">
                <ReviewUserInfo/>
                <ReviewInfo/>
            </div>
            <TrashLogo className="w-[32px] h-[32px] cursor-pointer"/>
        </div>
    )
}