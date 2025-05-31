"use server"

import fs from "fs/promises";
import path from "path";
import { Prisma } from "@prisma/client"
import { prisma } from "../../../prisma/prisma-client"
import sharp from "sharp";

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export async function createReview(formData: FormData): Promise<{
    success: boolean;
    review?: any;
    error?: string;
}> {
    try {
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment") as string;
        const photos = formData.getAll("photos") as string[];
        const userId = Number(formData.get("userId"));
        const orderId = Number(formData.get("orderId"));

        console.log("Received formData:", {
            rating,
            comment,
            photoCount: photos.length,
            userId,
            orderId,
        });

        // Validate rating
        if (isNaN(rating) || rating < 1 || rating > 5) {
            console.error("Validation error: Invalid rating", { rating });
            return {
                success: false,
                error: "Рейтинг должен быть от 1 до 5.",
            };
        }

        // Validate comment
        if (!comment || comment.trim().length === 0) {
            console.error("Validation error: Comment is empty");
            return {
                success: false,
                error: "Комментарий обязателен.",
            };
        }

        // Validate userId
        if (isNaN(userId)) {
            console.error("Validation error: Invalid userId", { userId });
            return {
                success: false,
                error: "Неверный идентификатор пользователя.",
            };
        }

        // Fetch the Item ID from OrderItem
        const orderItem = await prisma.orderItem.findFirst({
            where: { orderId },
            select: { itemId: true },
        });

        if (!orderItem) {
            console.error("No OrderItem found for orderId:", orderId);
            return {
                success: false,
                error: "Товар для заказа не найден.",
            };
        }

        const itemId = orderItem.itemId;

        // Validate photos and upload to Cloudinary
        let photoUrls: string[] = [];
        if (photos.length > 0) {
            const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
            const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
                throw new Error("Cloudinary configuration is missing");
            }

            for (const [index, photo] of photos.entries()) {
                if (!photo || !photo.startsWith("data:image/")) {
                    console.error(`Validation error: Invalid photo format at index ${index}`);
                    return {
                        success: false,
                        error: `Неверный формат изображения ${index + 1}.`,
                    };
                }

                const byteString = atob(photo.split(",")[1]);
                const mimeString = photo.split(",")[0].match(/:(.*?);/)![1];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const file = new File([blob], `photo_${index}.jpg`, { type: mimeString });

                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: "POST",
                    body: uploadFormData,
                });

                const data = await response.json();
                if (data.secure_url && isValidUrl(data.secure_url)) {
                    photoUrls.push(data.secure_url);
                } else {
                    console.error(`Upload error for photo ${index}:`, data);
                    return {
                        success: false,
                        error: `Ошибка при загрузке изображения ${index + 1}.`,
                    };
                }
            }
        }

        // Create the review with the uploaded photo URLs
        console.log("Attempting to create review in database...");
        const review = await prisma.review.create({
            data: {
                text: comment,
                photo: photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
                grade: rating,
                user: {
                    connect: { id: userId },
                },
                item: {
                    connect: { id: itemId }, // Use itemId instead of orderId
                },
            },
        });

        console.log("Review created successfully:", review);
        return {
            success: true,
            review,
        };
    } catch (error) {
        console.error("Error creating review:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return {
            success: false,
            error:
                error instanceof Error
                    ? `Не удалось создать отзыв: ${error.message}`
                    : "Не удалось создать отзыв: неизвестная ошибка",
        };
    } finally {
        await prisma.$disconnect();
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
        });

        const compressedReviews = await Promise.all(
            reviews.map(async (review) => {
                let photos = [];
                try {
                    if (review.photo) {
                        photos = JSON.parse(review.photo);
                        if (!Array.isArray(photos)) {
                            photos = [review.photo];
                        }

                        photos = await Promise.all(
                            photos.map(async (photoPath) => {
                                const outputPath = path.join("compressed", path.basename(photoPath));

                                try {
                                    await fs.access(outputPath);
                                    return outputPath;
                                } catch {
                                    try {
                                        await sharp(photoPath)
                                            .resize({ width: 300 })
                                            .jpeg({ quality: 80 })
                                            .toFile(outputPath);
                                        return outputPath;
                                    } catch (err) {
                                        console.error(`Error compressing image ${photoPath}:`, err);
                                        return photoPath;
                                    }
                                }
                            })
                        );
                    }
                } catch (e) {
                    if (review.photo) {
                        photos = [review.photo];
                    }
                    console.error("Error parsing photo JSON:", e);
                }

                return {
                    id: review.id,
                    text: review.text,
                    photo: review.photo,
                    photos,
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
                };
            })
        );

        return {
            success: true,
            reviews: compressedReviews,
        };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return {
            success: false,
            error: "Failed to fetch reviews",
        };
    } finally {
        await prisma.$disconnect();
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

