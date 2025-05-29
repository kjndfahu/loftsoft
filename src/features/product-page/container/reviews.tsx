"use client"

import { Review } from "@/features/product-page/ui/review"
import { useEffect, useState } from "react"
import { getAllReviews } from "@/enteties/review/review"
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

export const Reviews = () => {
    const [reviews, setReviews] = useState<ReviewData[]>([])
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(4) // Initially show 4 reviews
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true)
            try {
                const response = await getAllReviews()
                if (response.success && response.reviews) {
                    setReviews(response.reviews)
                } else {
                    setError(response.error || "Failed to load reviews")
                }
            } catch (err) {
                setError("Failed to fetch reviews")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchReviews()
    }, [])

    const handleShowMore = () => {
        setVisibleReviewsCount((prev) => prev + 4) // Load 4 more reviews
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse w-full rounded-[16px] h-[210px] bg-[#F5F7FF]"></div>
                ))}
            </div>
        )
    }

    if (error) {
        return <div>Error: {error}</div>
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