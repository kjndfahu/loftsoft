import { ReviewInfoSec } from "@/features/reviews/ui/review-info-sec";
import { AverageRating } from "@/features/reviews/ui/average-rating";
import { TotalReviews } from "@/features/reviews/ui/total-reviews";

interface ReviewData {
    id: number;
    text: string;
    photo: string;
    photos: string[];
    grade: number;
    createdAt: string;
    user: {
        id: number;
        email: string;
    } | null;
    item: {
        id: number;
        name: string;
    } | null;
}

interface ReviewsInfoProps {
    reviews?: ReviewData[];
}

export const ReviewsInfo = ({ reviews = [] }: ReviewsInfoProps) => {
    console.log(reviews);
    return (
        <div className="flex mds:flex-row flex-col w-full md:h-[158px] mds:h-[140px] md:gap-6 mds:gap-2 gap-3">
            <div className="flex w-full md:gap-6 mds:gap-2 gap-3 mds:flex-1">
                <div className="mds:flex flex-1 hidden">
                    <TotalReviews reviews={reviews?.length}/>
                </div>
                <div className="flex w-full mds:flex-1 mds:h-full">
                    <ReviewInfoSec/>
                </div>
            </div>
            <div className="mds:flex hidden">
                <AverageRating reviews={reviews}/>
            </div>
            <div className="mds:hidden flex w-full sm:gap-4 gap-2">
                <TotalReviews reviews={reviews?.length} />
                <AverageRating reviews={reviews} />
            </div>
        </div>
    );
};