import {ReviewUserInfo} from "@/features/product-page/ui/review-user-info";
import {ReviewInfo} from "@/features/product-page/ui/review-info";
import {CrossLogo} from "@/shared/icons";

export const ReviewModal = () => {
    return (
        <div className="flex relative w-[1144px] bg-white rounded-[24px] gap-6 p-6">
            <div style={{aspectRatio: 592 / 592}} className="w-[592px] h-[592px] rounded-[16px] bg-gray-400"/>
            <div className="flex flex-col gap-6">
                <ReviewUserInfo/>
                <ReviewInfo/>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-3">
                <div
                    className="flex items-center justify-center cursor-pointer rounded-full w-[52px] h-[36px] bg-[#DBDEEF]"></div>
                <div
                    className="flex items-center justify-center cursor-pointer rounded-full w-[52px] h-[36px] bg-[#DBDEEF]"></div>
            </div>
            <CrossLogo className="absolute cursor-pointer w-6 h-6 top-[24px] right-[24px]"/>
        </div>
    )
}