"use server"

import { Prisma } from "@prisma/client"
import { prisma } from "../../../prisma/prisma-client"

export async function createReview(formData: FormData): Promise<{
    success: boolean
    review?: any
    error?: string
}> {
    try {
        const rating = Number(formData.get("rating"))
        const comment = formData.get("comment") as string

        // Get all photos from FormData
        // Important: This is the key change - we're getting all entries with the name "photos"
        const photos = formData.getAll("photos") as string[]

        const userId = Number(1) // Hardcoded; replace with authenticated user ID
        const itemId = 1 // Hardcoded; replace with actual item ID

        // Log received FormData for debugging
        console.log("Received formData:", {
            rating,
            comment,
            photoCount: photos.length,
            userId,
            itemId,
        })

        // Validate rating
        if (isNaN(rating) || rating < 1 || rating > 5) {
            console.error("Validation error: Invalid rating", { rating })
            return {
                success: false,
                error: "Рейтинг должен быть от 1 до 5.",
            }
        }

        // Validate comment
        if (!comment || comment.trim().length === 0) {
            console.error("Validation error: Comment is empty")
            return {
                success: false,
                error: "Комментарий обязателен.",
            }
        }

        // Validate photos
        if (photos.length > 0) {
            for (const [index, photo] of photos.entries()) {
                if (!photo || photo === "") {
                    console.error(`Validation error: Empty photo at index ${index}`)
                    return {
                        success: false,
                        error: `Изображение ${index + 1} пустое.`,
                    }
                }
                if (!photo.match(/^data:image\/(png|jpeg|jpg|gif);base64,/)) {
                    console.error(`Validation error: Invalid photo format at index ${index}`)
                    return {
                        success: false,
                        error: `Неверный формат изображения ${index + 1}.`,
                    }
                }
                // Approximate size check for base64 (base64 is ~33% larger than raw)
                if (photo.length > (10 * 1024 * 1024) / 0.75) {
                    console.error(`Validation error: Photo at index ${index} is too large`)
                    return {
                        success: false,
                        error: `Изображение ${index + 1} слишком большое (макс. 10MB).`,
                    }
                }
            }
        }

        // Get the first photo URL or empty string if no photos
        const photoUrl = photos.length > 0 ? photos[0] : ""

        // Create the review with all photos
        console.log("Attempting to create review in database...")
        const review = await prisma.review.create({
            data: {
                text: comment,
                photo: JSON.stringify(photos), // Store all photos as JSON string
                grade: rating,
                userId,
                itemId,
            },
        })

        console.log("Review created successfully:", review)
        return {
            success: true,
            review,
        }
    } catch (error) {
        console.error("Error creating review:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        })

        // Handle unique constraint violation
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return {
                success: false,
                error: "Вы уже оставили отзыв для этого товара.",
            }
        }

        return {
            success: false,
            error:
                error instanceof Error
                    ? `Не удалось создать отзыв: ${error.message}`
                    : "Не удалось создать отзыв: неизвестная ошибка",
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function getAllReviews() {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: true,
                item: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return {
            success: true,
            reviews: reviews.map((review) => {

                let photos = []
                try {
                    if (review.photo) {
                        photos = JSON.parse(review.photo)
                        // Ensure photos is always an array
                        if (!Array.isArray(photos)) {
                            photos = [review.photo]
                        }
                    }
                } catch (e) {
                    // If parsing fails, treat the photo as a single string
                    if (review.photo) {
                        photos = [review.photo]
                    }
                    console.error("Error parsing photo JSON:", e)
                }

                return {
                    id: review.id,
                    text: review.text,
                    photo: review.photo,
                    photos: photos,
                    grade: review.grade,
                    createdAt: review.createdAt.toISOString(),
                    user: review.user
                        ? {
                            id: review.user.id,
                            email: review.user.email,
                        }
                        : null,
                    item: review.item
                        ? {
                            id: review.item.id,
                            name: review.item.name,
                        }
                        : null,
                }
            }),
        }
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return {
            success: false,
            error: "Failed to fetch reviews",
        }
    }
}

export async function deleteReview(reviewId: number) {
    try {
        await prisma.review.delete({
            where: { id: reviewId },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting review:", error);
        return { success: false, error: "Failed to delete review" };
    }
}

