import { ReviewStar } from "@/shared/icons";

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

interface AverageRatingProps {
    reviews?: ReviewData[];
}

export const AverageRating = ({ reviews = [] }: AverageRatingProps) => {
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
            : 0;

    const filledStars = Math.round(averageRating);

    return (
        <div className="flex flex-col xl:w-[428px] lg:w-[368px] mdbvp:w-[300px] md:w-[250px] mds:w-[200px] w-full gap-2 md:p-6 p-3.5 border-[1px] border-[#DBDEEF] rounded-[16px]">
            <h2 className="md:text-[16px] text-[13px] font-medium text-[#333438]">Средний рейтинг</h2>
            <div className="flex items-center mt-2 sml:gap-2 gap-1">
                <h2 className="md:text-[36px] sml:text-[28px] text-[24px] md:leading-[40px] sml:leading-[32px] leading-[28px] text-[#161616] font-semibold">
                    {averageRating.toFixed(1)}
                </h2>
                <div className="flex md:gap-2 sml:gap-1 gap-0.5 items-center">
                    {[...Array(filledStars)].map((_, index) => (
                        <ReviewStar
                            key={index}
                            className="md:w-[20px] sml:w-[18px] w-[15px] md:h-[20px] sml:h-[18px] h-[15px]"
                            color={index < filledStars ? "#FFAC33" : "#FFFFFF"}
                        />
                    ))}
                </div>
            </div>
            <p className="md:text-[14px] sml:text-[12px] text-[11px] text-[#4E4F56]">
                Средний рейтинг за этот год
            </p>
        </div>
    );
};