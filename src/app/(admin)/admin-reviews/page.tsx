"use client";

import { useState, useEffect } from "react";
import { AdminReview } from "@/features/admin-reviews/ui/admin-review";
import { getAllReviews } from "@/enteties/review/review";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const { success, reviews, error } = await getAllReviews();
                if (success && reviews) {
                    setReviews(reviews);
                } else {
                    setError(error || "Не удалось загрузить отзывы");
                }
            } catch (err) {
                setError("Не удалось загрузить отзывы");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDelete = (reviewId) => {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    };

    if (loading) {
        return (
            <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] gap-5">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] gap pump-5">
                <p className="text-red-500">Ошибка: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] gap-5">
            {reviews.length === 0 ? (
                <p className="text-[#4E4F56]">Нет доступных отзывов</p>
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
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
}