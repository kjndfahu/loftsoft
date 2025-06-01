// page.tsx
"use client";

import { BreadcrumbNav } from "@/shared/breadcrumb-nav";
import { ReviewsInfo } from "@/features/reviews/ui/reviews-info";
import { Review } from "@/features/product-page/ui/review";
import RatingVisualization from "@/features/reviews/ui/rating-visualization";
import {useCatalog} from "@/features/header/catalog-context";


export default function ReviewsPage() {
    const { reviews, isReviewsLoading, reviewsError } = useCatalog();

    return (
        <div className="flex flex-col mds:pt-[150px] pt-[80px] sml:pb-0 mb-[82px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Отзывы" />
            <div className="flex flex-col md:gap-8 gap-5">
                <ReviewsInfo reviews={reviews} />
                <div className="flex mds:flex-row flex-col w-full md:gap-6 mds:gap-2 gap-4">
                    <div className="flex flex-1 h-auto flex-col gap-4">
                        {isReviewsLoading ? (
                            <div className="flex flex-col gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="animate-pulse w-full rounded-[16px] h-[210px] bg-[#F5F7FF]"
                                    />
                                ))}
                            </div>
                        ) : reviewsError ? (
                            <div className="text-center py-8 text-red-500">{reviewsError}</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8">Отзывов пока нет</div>
                        ) : (
                            reviews.map((review) => (
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
                    </div>
                    {isReviewsLoading ? (
                        <div className="animate-pulse rounded-[16px] md:h-[197px] h-[180px] xl:w-[428px] lg:w-[368px] mdbvp:w-[300px] md:w-[250px] mds:w-[200px] w-full bg-[#F5F7FF]" />
                    ) : (
                        <RatingVisualization reviews={reviews} />
                    )}
                </div>
            </div>
        </div>
    );
}