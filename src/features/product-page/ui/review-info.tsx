"use client"

import { Star } from "@/shared/icons"
import { type FC, useState } from "react"
import { Modal } from "@/shared/modal"
import { ReviewModal } from "@/features/reviews/ui/review-modal"

interface Props {
    isImage: boolean
    text: string
    grade: number
    createdAt: string
    photos?: string[]
    hideModal?: boolean
    user?: {
        id: number
        email: string
    } | null
    item?: {
        id: number
        name: string
    } | null
}

export const ReviewInfo: FC<Props> = ({ isImage, text, grade, createdAt, photos = [], hideModal, user, item }) => {
    const [isModal, setIsModal] = useState(false)
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className="md:w-[16px] w-[14px] md:h-[16px] h-[14px]"
                    color={i <= grade ? "#FFAC33" : "#CECDCC"}
                />,
            )
        }
        return stars
    }

    const openModal = (index: number) => {
        setSelectedPhotoIndex(index)
        setIsModal(true)
    }

    const closeModal = () => {
        setIsModal(false)
    }

    const goToPreviousPhoto = () => {
        if (selectedPhotoIndex > 0) {
            setSelectedPhotoIndex(selectedPhotoIndex - 1)
        }
    }

    const goToNextPhoto = () => {
        if (selectedPhotoIndex < photos.length - 1) {
            setSelectedPhotoIndex(selectedPhotoIndex + 1)
        }
    }

    return (
        <div className="flex md:w-[65%] sml:w-[40%] sml:flex-col flex-col-reverse md:gap-6 gap-4">
            <div className="flex items-center md:gap-4 gap-2">
                <div className="flex md:gap-2 gap-1">{renderStars()}</div>
                <p className="md:text-[16px] text-[13px] text-[#4E4F56]">{new Date(createdAt).toLocaleDateString("ru-RU")}</p>
            </div>
            <p className="md:text-[16px] text-[13px] text-[#333438]">{text}</p>
            {isImage && photos.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            onClick={() => openModal(index)}
                            style={{ aspectRatio: 1 / 1 }}
                            className="w-[64px] h-[64px] rounded-[12px] overflow-hidden cursor-pointer"
                        >
                            <img
                                src={photo || "/placeholder.svg"}
                                alt={`Review photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
            {isModal && !hideModal && (
                <Modal
                    setModalOpen={setIsModal}
                    form={
                        <ReviewModal
                            user={user}
                            item={item}
                            photos={photos}
                            selectedPhotoIndex={selectedPhotoIndex}
                            onClose={closeModal}
                            onPrevious={goToPreviousPhoto}
                            onNext={goToNextPhoto}
                            text={text}
                            grade={grade}
                            createdAt={createdAt}
                        />
                    }
                />
            )}
        </div>
    )
}
