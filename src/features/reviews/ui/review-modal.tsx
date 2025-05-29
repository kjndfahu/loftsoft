"use client"

import type { FC } from "react"
import { ReviewUserInfo } from "@/features/product-page/ui/review-user-info"
import { ReviewInfo } from "@/features/product-page/ui/review-info"
import { CrossLogo } from "@/shared/icons"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ReviewModalProps {
    photos: string[]
    selectedPhotoIndex: number
    onClose: () => void
    onPrevious: () => void
    onNext: () => void
    text?: string
    grade?: number
    createdAt?: string
    user?: {
        id: number
        email: string
    } | null
    item?: {
        id: number
        name: string
    } | null
}

export const ReviewModal: FC<ReviewModalProps> = ({
                                                      photos,
                                                      selectedPhotoIndex,
                                                      onClose,
                                                      onPrevious,
                                                      onNext,
                                                      text,
                                                      grade,
                                                      createdAt,
                                                      user,
                                                      item,
                                                  }) => {
    return (
        <div className="flex sml:flex-row flex-col relative w-[1144px] bg-white rounded-[24px] gap-6 p-6">
            <div style={{aspectRatio: 1 / 1}} className="md:w-[592px] sm:w-[400px] w-[320px] md:h-[592px] sm:h-[400px] h-[320px] rounded-[16px] overflow-hidden">
                <img
                    src={photos[selectedPhotoIndex] || "/placeholder.svg"}
                    alt={`Review photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col gap-6 flex-1">
                <ReviewUserInfo user={user} item={item}/>
                <ReviewInfo
                    isImage={photos.length > 0}
                    text={text || ""}
                    grade={grade || 0}
                    createdAt={createdAt || ""}
                    photos={photos}
                    hideModal={true}
                />
            </div>
            <div className="absolute bottom-6 right-6 flex gap-3">
                <button
                    onClick={onPrevious}
                    disabled={selectedPhotoIndex === 0}
                    className={`flex items-center justify-center cursor-pointer rounded-full w-[52px] h-[36px] ${selectedPhotoIndex === 0 ? "bg-[#DBDEEF] cursor-not-allowed" : "bg-[#5069E8] "}`}
                >
                    <ChevronLeft className="w-5 h-5"/>
                </button>
                <button
                    onClick={onNext}
                    disabled={selectedPhotoIndex === photos.length - 1}
                    className={`flex items-center justify-center cursor-pointer rounded-full w-[52px] h-[36px] ${selectedPhotoIndex === photos.length - 1 ? "bg-[#DBDEEF] cursor-not-allowed" : "bg-[#5069E8]"}`}
                >
                    <ChevronRight className="w-5 h-5"/>
                </button>
            </div>
            <button onClick={onClose} className="absolute cursor-pointer w-6 h-6 sm:top-[24px] top-[5px] sm:right-[24px] right-[12px]">
                <CrossLogo className="w-6 h-6"/>
            </button>
        </div>
    )
}
