import {Review} from "@/features/product-page/ui/review";
import RatingDisplay from "@/features/product-page/ui/rating-display";

export const Reviews = () => {
    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-[27px] text-[#161616]">Отзывы</h2>
            <div className="flex w-full gap-6">
                <div className="flex flex-col gap-4 flex-1">
                    <Review/>
                    <Review/>
                    <Review/>
                    <Review/>
                </div>
                <RatingDisplay/>
            </div>
        </div>
    )
}