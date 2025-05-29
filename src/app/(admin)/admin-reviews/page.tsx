import { AdminReview } from "@/features/admin-reviews/ui/admin-review";
import {getAllReviews} from "@/enteties/review/review";


export default async function AdminReviewsPage() {
    const { success, reviews, error } = await getAllReviews();

    if (!success || !reviews) {
        return (
            <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] gap-5">
                <p className="text-red-500">Error: {error || "Unable to load reviews"}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] gap-5">
            {reviews.length === 0 ? (
                <p className="text-[#4E4F56]">No reviews available</p>
            ) : (
                reviews.map((review) => (
                    <AdminReview
                        key={review.id}
                        reviewId={review.id}
                        text={review.text}
                        grade={review.grade}
                        createdAt={review.createdAt}
                        photos={review.photos}
                        user={review.user}
                        item={review.item}
                    />
                ))
            )}
        </div>
    );
}