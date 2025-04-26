"use client"

import type React from "react"

import { CrossLogo } from "@/shared/icons"
import type { FC } from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { UploadIcon, Plus, Loader2 } from "lucide-react"
import { CategoryPopup } from "./category-popup"
import { SubscriptionTypePopup, type SubscriptionType } from "./subscription-type-popup"
import { LicenseDurationPopup, type LicenseDuration } from "./license-duration-popup"
import { CharacteristicItem } from "./characteristic-item"
import { FileUploadItem } from "./file-upload-item"
import { createProduct } from "@/enteties/product/product"

interface Props {
    setIsOpen: (arg: boolean) => void
}

interface Category {
    id: string
    title: string
    description: string
    photo: string
    createdAt: Date
}

interface Characteristic {
    title: string
    value: string
}

interface DistributiveFile {
    file: File | null
    displayName: string
    fileUrl?: string
}

// Маппинг для преобразования типов подписки
const subscriptionTypeMap = {
    key: "KEY",
    subscription: "SUBSCRIPTION",
    account: "ACCOUNT",
} as const

const licenseDurationMap = {
    perpetual: "PERPETUAL",
    "1month": "ONE_MONTH",
    "3months": "THREE_MONTHS",
    "6months": "SIX_MONTHS",
    "1year": "ONE_YEAR",
} as const

export const CreateProductForm: FC<Props> = ({ setIsOpen }) => {
    const [image, setImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<SubscriptionType | null>(null)
    const [selectedLicenseDuration, setSelectedLicenseDuration] = useState<LicenseDuration | null>(null)
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([{ title: "", value: "" }])
    const [distributiveFiles, setDistributiveFiles] = useState<DistributiveFile[]>([{ file: null, displayName: "" }])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onload = (event) => {
                setImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category)
    }

    const handleSubscriptionTypeSelect = (subscriptionType: SubscriptionType) => {
        setSelectedSubscriptionType(subscriptionType)
    }

    const handleLicenseDurationSelect = (duration: LicenseDuration) => {
        setSelectedLicenseDuration(duration)
    }

    const handleAddCharacteristic = () => {
        setCharacteristics([...characteristics, { title: "", value: "" }])
    }

    const handleRemoveCharacteristic = (index: number) => {
        const newCharacteristics = [...characteristics]
        newCharacteristics.splice(index, 1)
        setCharacteristics(newCharacteristics)
    }

    const handleChangeCharacteristic = (index: number, title: string, value: string) => {
        const newCharacteristics = [...characteristics]
        newCharacteristics[index] = { title, value }
        setCharacteristics(newCharacteristics)
    }

    const handleAddFile = () => {
        setDistributiveFiles([...distributiveFiles, { file: null, displayName: "" }])
    }

    const handleRemoveFile = (index: number) => {
        const newFiles = [...distributiveFiles]
        newFiles.splice(index, 1)
        setDistributiveFiles(newFiles)
    }

    const handleChangeFile = (index: number, file: File | null, displayName: string) => {
        const newFiles = [...distributiveFiles]
        newFiles[index] = { file, displayName }
        setDistributiveFiles(newFiles)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Валидация формы
        if (!title) {
            setError("Введите название товара")
            return
        }

        if (!price) {
            setError("Введите цену товара")
            return
        }

        if (!selectedCategory) {
            setError("Выберите категорию товара")
            return
        }

        if (!selectedSubscriptionType) {
            setError("Выберите тип подписки")
            return
        }

        if (!selectedLicenseDuration) {
            setError("Выберите срок лицензии")
            return
        }

        if (!imageFile) {
            setError("Загрузите изображение товара")
            return
        }

        try {
            setIsSubmitting(true)
            setError(null) // Clear any previous errors

            // Вместо загрузки изображения через API, используем base64 строку напрямую
            if (!image) {
                throw new Error("Изображение товара не выбрано")
            }

            // Создаем массив для хранения дистрибутивов
            const uploadedDistributives = []

            // Для каждого дистрибутива создаем запись с путем к файлу
            for (const distributive of distributiveFiles) {
                if (distributive.file && distributive.displayName) {
                    // Генерируем путь к файлу в формате "/distributives/{timestamp}_{filename}"
                    const timestamp = Date.now()
                    const fileName = distributive.file.name.replace(/\s+/g, "_")
                    const filePath = `/distributives/${timestamp}_${fileName}`

                    uploadedDistributives.push({
                        displayName: distributive.displayName,
                        fileUrl: filePath,
                    })
                }
            }

            // Создание товара
            const result = await createProduct({
                name: title,
                price,
                photo: image, // Используем base64 строку напрямую для фото
                description,
                categoryId: Number.parseInt(selectedCategory.id),
                type: subscriptionTypeMap[selectedSubscriptionType.id as keyof typeof subscriptionTypeMap],
                licenseType: licenseDurationMap[selectedLicenseDuration.id as keyof typeof licenseDurationMap],
                characteristics: characteristics.filter((char) => char.title && char.value),
                distributives: uploadedDistributives,
            })

            if (result.success) {
                // Успешное создание товара - закрываем форму
                setIsOpen(false)
            } else {
                // Ошибка при создании товара
                throw new Error(result.error || "Ошибка при создании товара")
            }
        } catch (error: any) {
            console.error("Error creating product:", error)
            setError(error.message || "Произошла ошибка при создании товара")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-[800px] pt-4 pb-7 px-6 bg-white rounded-[16px] max-h-[90vh] overflow-y-auto"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[22px] font-bold text-[#161616]">Создать товар</h3>
                <div onClick={() => setIsOpen(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

            <div className="flex flex-row gap-6">
                {/* Левая колонка - основная информация */}
                <div className="flex flex-col gap-4 w-1/2">
                    <div
                        className={`relative h-[250px] rounded-[16px] overflow-hidden ${
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
                                <Image src={image || "/placeholder.svg"} alt="Category image" fill style={{ objectFit: "cover" }} />
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
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                            <input
                                className="bg-transparent w-full outline-0 text-[#161616]"
                                placeholder="Введите название товара"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                            <input
                                className="bg-transparent w-full outline-0 text-[#161616]"
                                placeholder="Цена"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <CategoryPopup onSelect={handleCategorySelect} selectedCategory={selectedCategory} />
                    </div>

                    <div className="flex items-center gap-3">
                        <SubscriptionTypePopup onSelect={handleSubscriptionTypeSelect} selectedType={selectedSubscriptionType} />
                        <LicenseDurationPopup onSelect={handleLicenseDurationSelect} selectedDuration={selectedLicenseDuration} />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
              <textarea
                  className="bg-transparent w-full outline-0 text-[#161616] min-h-[100px]"
                  placeholder="Введите описание товара"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
                        </div>
                    </div>
                </div>

                {/* Правая колонка - характеристики и дистрибутивы */}
                <div className="flex flex-col gap-6 w-1/2">
                    {/* Характеристики товара */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[16px] font-semibold text-[#161616]">Характеристики товара:</h4>
                            <button
                                type="button"
                                onClick={handleAddCharacteristic}
                                className="flex items-center gap-1 text-[14px] text-[#161616]"
                            >
                                <Plus className="w-4 h-4" /> Добавить
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {characteristics.map((characteristic, index) => (
                                <CharacteristicItem
                                    key={index}
                                    index={index}
                                    title={characteristic.title}
                                    value={characteristic.value}
                                    onChange={handleChangeCharacteristic}
                                    onRemove={handleRemoveCharacteristic}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Дистрибутивы */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[16px] font-semibold text-[#161616]">Дистрибутивы:</h4>
                            <button
                                type="button"
                                onClick={handleAddFile}
                                className="flex items-center gap-1 text-[14px] text-[#161616]"
                            >
                                <Plus className="w-4 h-4" /> Добавить
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {distributiveFiles.map((file, index) => (
                                <FileUploadItem
                                    key={index}
                                    index={index}
                                    fileName={file.displayName}
                                    onChange={handleChangeFile}
                                    onRemove={handleRemoveFile}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 gap-[6px] mt-4 border-t border-[#DBDEEF]">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-[16px] w-[97px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                    disabled={isSubmitting}
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-[16px] w-[122px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616] flex items-center justify-center`}
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Создать"}
                </button>
            </div>
        </form>
    )
}
