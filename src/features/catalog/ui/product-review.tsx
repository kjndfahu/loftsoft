"use client"

import { Review } from "@/features/product-page/ui/review"
import { useState } from "react"
import RatingVisualization from "@/features/reviews/ui/rating-visualization"

interface ReviewData {
    id: number
    text: string
    photo: string
    photos: string[]
    grade: number
    createdAt: string
    user: {
        id: number
        email: string
    } | null
    item: {
        id: number
        name: string
    } | null
}

interface ProductReviewsProps {
    itemId: number
    reviews: ReviewData[]
}

export const ProductReviews = ({ itemId, reviews }: ProductReviewsProps) => {
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(4) // Initially show 4 reviews

    const handleShowMore = () => {
        setVisibleReviewsCount((prev) => prev + 4) // Load 4 more reviews
    }

    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-[27px] text-[#161616]">Отзывы</h2>
            <div className="flex mds:flex-row flex-col w-full gap-6">
                <div className="flex flex-col gap-4 flex-1">
                    {reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        reviews.slice(0, visibleReviewsCount).map((review) => (
                            <Review
                                key={review.id}
                                text={review.text}
                                grade={review.grade}
                                createdAt={review.createdAt}
                                photo={review.photos}
                                user={review.user}
                                item={review.item}
                            />
                        ))
                    )}
                    {reviews.length > visibleReviewsCount && (
                        <button
                            onClick={handleShowMore}
                            className="mt-4 w-full bg-[#5069E8] rounded-full py-2 px-4 text-[16px] font-semibold text-white transition-colors"
                        >
                            Показать больше
                        </button>
                    )}
                </div>
                <RatingVisualization reviews={reviews} />
            </div>
        </div>
    )
}