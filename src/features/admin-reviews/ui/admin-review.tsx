"use client";

import { ReviewUserInfo } from "@/features/product-page/ui/review-user-info";
import { ReviewInfo } from "@/features/product-page/ui/review-info";
import { TrashLogo } from "@/shared/icons";
import { deleteReview } from "@/enteties/review/review";

interface Props {
    reviewId: number;
    text: string;
    grade: number;
    createdAt: string;
    photos: string[];
    user?: { id: number; email: string } | null;
    item?: { id: number; name: string } | null;
    onDelete: (reviewId: number) => void;
}

export const AdminReview = ({ reviewId, text, grade, createdAt, photos, user, item, onDelete }: Props) => {
    const handleDelete = async () => {
        if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
            try {
                const result = await deleteReview(reviewId);
                if (result.success) {
                    onDelete(reviewId); // Notify parent to update reviews state
                } else {
                    console.error("Не удалось удалить отзыв");
                }
            } catch (err) {
                console.error("Ошибка при удалении отзыва:", err);
            }
        }
    };

    return (
        <div className="flex sml:gap-5 gap-2 items-start">
            <div className="flex sml:flex-row flex-col w-full flex-1 mdbvp:gap-[100px] md:gap-16 gap-8 justify-between rounded-[16px] md:p-6 p-3 border-[1px] border-[#E9EBF6]">
                <ReviewUserInfo user={user} item={item} />
                <ReviewInfo
                    isImage={photos.length > 0}
                    text={text}
                    grade={grade}
                    createdAt={createdAt}
                    photos={photos}
                    user={user}
                    item={item}
                />
            </div>
            <div onClick={handleDelete}>
                <TrashLogo className="sml:w-[32px] w-[20px] sml:h-[32px] h-[20px] cursor-pointer" />
            </div>
        </div>
    );
};