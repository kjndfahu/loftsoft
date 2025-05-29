import { ReviewUserInfo } from "@/features/product-page/ui/review-user-info"
import { ReviewInfo } from "@/features/product-page/ui/review-info"

interface ReviewProps {
    text: string
    grade: number
    createdAt: string
    photo?: string | string[]
    user?: {
        id: number
        email: string
    } | null
    item?: {
        id: number
        name: string
    } | null
}

export const Review = ({ text, grade, createdAt, photo, user, item }: ReviewProps) => {
    let photos: string[] = []

    if (Array.isArray(photo)) {
        photos = photo
    } else if (typeof photo === "string") {
        try {
            const parsed = JSON.parse(photo)
            photos = Array.isArray(parsed) ? parsed : [photo]
        } catch (e) {
            photos = photo ? [photo] : []
        }
    }

    return (
        <div className="flex sml:flex-row flex-col w-full flex-1 md:gap-[100px] sml:gap-0 gap-5 justify-between rounded-[16px] md:p-6 p-3.5 border-[1px] border-[#E9EBF6]">
            <ReviewUserInfo user={user} item={item} />
            <ReviewInfo user={user} item={item} isImage={photos.length > 0} text={text} grade={grade} createdAt={createdAt} photos={photos} />
        </div>
    )
}
