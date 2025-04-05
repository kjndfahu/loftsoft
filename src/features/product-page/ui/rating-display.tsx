"use client"

import { useState } from "react"

interface RatingData {
    average: number
    totalReviews: number
    distribution: {
        [key: number]: number
    }
}

export default function RatingDisplay() {
    const [ratingData, setRatingData] = useState<RatingData>({
        average: 4.2,
        totalReviews: 504,
        distribution: {
            5: 4800,
            4: 1800,
            3: 300,
            2: 50,
            1: 12,
        },
    })

    console.log(setRatingData)

    const maxCount = Math.max(...Object.values(ratingData.distribution))

    return (
        <div className="bg-white rounded-xl p-4 border-[1px] border-[#DBDEEF] w-[368px]">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-amber-500">{ratingData.average}</span>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} filled={star <= Math.round(ratingData.average)} />
                    ))}
                </div>
                <span className="text-gray-500 text-sm">{ratingData.totalReviews} отзыва</span>
            </div>

            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                        <span className="w-3 text-gray-600">{rating}</span>
                        <div className="relative h-2 flex-grow bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full rounded-full ${getBarColor(rating)}`}
                                style={{
                                    width: `${(ratingData.distribution[rating] / maxCount) * 100}%`,
                                }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 w-10">{formatNumber(ratingData.distribution[rating])}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"
    }
    return num.toString()
}

function getBarColor(rating: number): string {
    switch (rating) {
        case 5:
            return "bg-amber-400"
        case 4:
            return "bg-amber-300"
        case 3:
            return "bg-green-400"
        case 2:
            return "bg-red-300"
        case 1:
            return "bg-red-200"
        default:
            return "bg-gray-300"
    }
}

function StarIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={filled ? "#FBBF24" : "none"}
            stroke={filled ? "#FBBF24" : "#D1D5DB"}
            strokeWidth="2"
            className="inline-block"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}

