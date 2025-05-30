"use client"

import type React from "react"
import { CrossLogo } from "@/shared/icons"
import type { FC, FormEvent } from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { UploadIcon } from "lucide-react"
import { createCategory } from "@/enteties/category/category"
import { Category } from "@/features/home/ui/items-grid"

interface Props {
    setIsOpen: (arg: boolean) => void
    onCategoryCreated: (category: Category) => void
}

export const CreateCategoryForm: FC<Props> = ({ setIsOpen, onCategoryCreated }) => {
    const [image, setImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Cloudinary configuration
    const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            try {
                const formData = new FormData()
                if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_UPLOAD_URL) {
                    throw new Error("Cloudinary configuration is missing")
                }

                formData.append("file", file)
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: "POST",
                    body: formData,
                })

                const data = await response.json()
                if (data.secure_url) {
                    setImage(data.secure_url)
                } else {
                    setError("Ошибка при загрузке изображения")
                }
            } catch (error) {
                console.error("Ошибка при загрузке изображения:", error)
                setError("Не удалось загрузить изображение")
            }
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!title.trim()) {
            setError("Название категории обязательно")
            return
        }

        if (!description.trim()) {
            setError("Описание категории обязательно")
            return
        }

        if (!image) {
            setError("Изображение обязательно")
            return
        }

        try {
            setIsSubmitting(true)

            const newCategory = await createCategory({
                title,
                description,
                photo: image, // Now a Cloudinary URL
            })

            onCategoryCreated({
                id: newCategory.id || Date.now(), // Use server-provided ID or fallback to timestamp
                title,
                description,
                photo: image,
                createdAt: new Date(),
                updateAt: new Date(),
            })

            setIsOpen(false)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Произошла ошибка при создании категории")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[500px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Создать категорию</h3>
                <div onClick={() => setIsOpen(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            <div
                className={`relative h-[300px] rounded-[16px] overflow-hidden ${
                    image ? "" : "bg-[#B9BCCB]"
                } cursor-pointer transition-all duration-200 ${
                    isHovering && !image ? "bg-[#A4A8BA]" : ""
                } flex items-center justify-center`}
                onClick={handleImageClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {image ? (
                    <>
                        <Image src={image} alt="Category image" fill style={{ objectFit: "cover" }} />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div className="bg-white p-2 rounded-full opacity-0 hover:opacity-100 transition-all duration-200">
                                <UploadIcon className="w-6 h-6 text-[#161616]" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                        <UploadIcon className="w-10 h-10 mb-2" />
                        <p className="text-sm font-medium">Нажмите, чтобы загрузить изображение</p>
                        <p className="text-xs opacity-70 mt-1">Рекомендуемый размер: 424x133px</p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex items-center gap-3">
                <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-full">
                    <input
                        className="bg-transparent w-full outline-0 text-[#161616]"
                        placeholder="Введите название категории"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
                    <textarea
                        className="bg-transparent w-full outline-0 text-[#161616]"
                        placeholder="Введите описание категории"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2 gap-[6px]">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-[16px] w-[97px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-[16px] w-[122px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616] ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? "Создание..." : "Создать"}
                </button>
            </div>
        </form>
    )
}