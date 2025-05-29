"use client"
import { Star } from "@/shared/icons"

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

interface RatingVisualizationProps {
    reviews?: ReviewData[]
}

export default function RatingVisualization({ reviews = [] }: RatingVisualizationProps) {

    const calculateRatingCounts = () => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

        reviews.forEach((review) => {
            if (review.grade >= 1 && review.grade <= 5) {
                counts[review.grade as keyof typeof counts]++
            }
        })

        return [
            { rating: 5, count: counts[5], color: "#FFD700" },
            { rating: 4, count: counts[4], color: "#4169E1" },
            { rating: 3, count: counts[3], color: "#2E8B57" },
            { rating: 2, count: counts[2], color: "#FF6B6B" },
            { rating: 1, count: counts[1], color: "#8A2BE2" },
        ]
    }

    const ratingData = calculateRatingCounts()

    const totalRatings = ratingData.reduce((sum, item) => sum + item.count, 0)

    const formatCount = (count: number): string => {
        return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString()
    }

    return (
        <div className="flex flex-col gap-2 bg-white rounded-[16px] md:p-6 mds:p-3.5 p-4 border-[1px] border-[#DBDEEF] md:h-[197px] h-[180px] xl:w-[428px] lg:w-[368px] mdbvp:w-[300px] md:w-[250px] mds:w-[200px] w-full">
            {ratingData.map((item) => (
                <div key={item.rating} className="flex items-center ">
                    <div className="flex items-center gap-1.5 w-10 md:mr-2.5">
                        <Star color="#CECDCC" className="w-[12px] h-[12px]" />
                        <span className="text-base font-medium text-gray-600">{item.rating}</span>
                    </div>

                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden md:mr-2.5">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${(item.count / totalRatings) * 100}%`,
                                backgroundColor: item.color,
                            }}
                        />
                    </div>

                    <div className="w-12 text-right text-base font-medium text-gray-800">{formatCount(item.count)}</div>
                </div>
            ))}
        </div>
    )
}
