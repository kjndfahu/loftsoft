import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {ReviewsInfo} from "@/features/reviews/ui/reviews-info";
import {Review} from "@/features/product-page/ui/review";
import RatingDisplay from "@/features/product-page/ui/rating-display";

export default function ReviewsPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title="Отзывы"/>
            <div className="flex gap-6">
                <div className="flex flex-col gap-8">
                    <ReviewsInfo/>
                    <Review/>
                </div>
                <RatingDisplay/>
            </div>
        </div>
    );
}
