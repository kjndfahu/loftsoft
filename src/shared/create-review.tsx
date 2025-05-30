"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { X, Star } from "lucide-react";
import { createReview } from "@/enteties/review/review";
import {useUser} from "@/enteties/auth/use-user";

interface CreateReviewProps {
    setIsReview: (arg: boolean) => void;
    orderId: number;
}

export const CreateReview = ({ setIsReview, orderId }: CreateReviewProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            setError(null);
            const files = event.target.files;
            if (!files || files.length === 0) {
                setError("No files selected");
                return;
            }

            try {
                const newPhotos = await Promise.all(
                    Array.from(files)
                        .slice(0, 3 - photos.length) // Limit to 3 photos
                        .map(async (file) => {
                            if (file.size > 5 * 1024 * 1024) {
                                throw new Error(`File ${file.name} exceeds 5MB limit`);
                            }
                            if (!file.type.startsWith("image/")) {
                                throw new Error(`File ${file.name} is not a valid image`);
                            }
                            return new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const result = reader.result as string;
                                    if (!result || result === "") {
                                        reject(new Error(`Failed to read file ${file.name}: Empty result`));
                                    } else {
                                        resolve(result);
                                    }
                                };
                                reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
                                reader.readAsDataURL(file);
                            });
                        }),
                );

                const validPhotos = newPhotos.filter((photo) => photo && photo.startsWith("data:image/"));
                if (validPhotos.length > 0) {
                    setPhotos((prev) => [...prev, ...validPhotos]);
                } else {
                    setError("No valid images were selected");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to upload photos");
            }
        },
        [photos.length],
    );

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const { user } = useUser();

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("orderId", orderId.toString());
            formData.append("rating", rating.toString());
            formData.append("comment", comment);
            formData.append("userId", user?.id?.toString() || ""); // Pass userId
            photos.forEach((photo) => {
                if (photo && photo.startsWith("data:image/")) {
                    formData.append("photos", photo);
                }
            });

            const response = await createReview(formData);

            if (response.success) {
                setRating(0);
                setComment("");
                setPhotos([]);
                setIsReview(false);
            } else {
                setError(response.error || "Failed to create review");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error during submission");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-[648px] bg-white rounded-[16px] px-6 pt-4 pb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[22px] font-bold text-[#161616]">Добавить отзыв</h3>
                <button onClick={() => setIsReview(false)} className="focus:outline-none">
                    <X className="w-6 h-6 cursor-pointer text-[#161616]" />
                </button>
            </div>

            {error && <div className="text-red-500 text-[14px] mb-4">{error}</div>}

            <div className="flex flex-col gap-[5px]">
                <h4 className="text-[12px] text-[#A4A8BA]">Комментарий</h4>
                <textarea
                    placeholder="Ваш текст"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="py-2 px-[15px] text-[#161616] outline-0 text-[14px] w-full placeholder:text-[#A4A8BA] border rounded-[8px] resize-none h-[160px]"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex gap-1 mt-[13px] mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none" type="button">
                        <Star
                            fill={star <= rating ? "#FFAC33" : "none"}
                            stroke={star <= rating ? "#FFAC33" : "#D1D5DB"}
                            className="w-6 h-6"
                        />
                    </button>
                ))}
            </div>

            <div className="flex flex-col border-b-[1px] pb-6 gap-5">
                <h4 className="text-[18px] font-bold text-[#161616]">Фото товара</h4>
                <div className="flex items-center gap-6">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative">
                            <img
                                src={photo || "/placeholder.svg"}
                                alt={`Фото ${index + 1}`}
                                className="w-[64px] h-[64px] rounded-[8px] object-cover"
                            />
                            <button
                                onClick={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                type="button"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {photos.length < 3 && (
                        <label className="w-[64px] h-[64px] rounded-[8px] bg-white border-[2px] border-dashed border-[#B9B9B9] flex items-center justify-center cursor-pointer">
                            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                            <span className="text-[24px] text-gray-500">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20 5H16.83L15.59 3.65C15.22 3.24 14.68 3 14.12 3H9.88C9.32 3 8.78 3.24 8.4 3.65L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5ZM12.0001 10.0005C10.3433 10.0005 9.00012 11.3436 9.00012 13.0005C9.00012 14.6573 10.3433 16.0005 12.0001 16.0005C13.657 16.0005 15.0001 14.6573 15.0001 13.0005C15.0001 11.3436 13.657 10.0005 12.0001 10.0005ZM6.99988 12.9995C6.99988 15.7595 9.23988 17.9995 11.9999 17.9995C14.7599 17.9995 16.9999 15.7595 16.9999 12.9995C16.9999 10.2395 14.7599 7.99951 11.9999 7.99951C9.23988 7.99951 6.99988 10.2395 6.99988 12.9995Z"
                      fill="#161616"
                  />
                </svg>
              </span>
                        </label>
                    )}
                    {photos.length === 0 && (
                        <p className="text-[12px] text-[#6A6B75]">
                            Чтобы загрузить фото, нажмите на иконку
                            <br /> или перетащите его в это поле
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-6 gap-[6px]">
                <button
                    onClick={() => setIsReview(false)}
                    type="button"
                    className="text-[16px] w-[97px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                    disabled={isSubmitting}
                >
                    Отмена
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-[16px] w-[122px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616] disabled:opacity-70"
                    disabled={!rating || !comment.trim() || isSubmitting}
                >
                    {isSubmitting ? "Отправка..." : "Отправить"}
                </button>
            </div>
        </div>
    );
};