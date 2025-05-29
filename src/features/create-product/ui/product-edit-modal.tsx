"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { CrossLogo } from "@/shared/icons"
import { UploadIcon, Plus, Loader2 } from "lucide-react"
import { CategoryPopup } from "@/features/create-product/ui/category-popup"
import { SubscriptionTypePopup, type SubscriptionType } from "@/features/create-product/ui/subscription-type-popup"
import { LicenseDurationPopup, type LicenseDuration } from "@/features/create-product/ui/license-duration-popup"
import { CharacteristicItem } from "@/features/create-product/ui/characteristic-item"
import { FileUploadItem } from "@/features/create-product/ui/file-upload-item"
import {updateProduct} from "@/enteties/product/update-product";


interface Product {
    id: number
    name: string
    price: string
    photo: string
    description: string
    categoryId: number
    type: string[]
    licenseType: string
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string }[]
    category: { id: string; title: string }
}

interface ProductEditModalProps {
    product: Product
    isOpen: boolean
    onClose: () => void
}

// Маппинг для преобразования типов подписки
const subscriptionTypeMap = {
    KEY: "key",
    SUBSCRIPTION: "subscription",
    ACCOUNT: "account",
} as const

const licenseDurationMap = {
    PERPETUAL: "perpetual",
    ONE_MONTH: "1month",
    THREE_MONTHS: "3months",
    SIX_MONTHS: "6months",
    ONE_YEAR: "1year",
} as const

export function ProductEditModal({ product, isOpen, onClose }: ProductEditModalProps) {
    const [image, setImage] = useState<string | null>(product.photo)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [title, setTitle] = useState(product.name)
    const [description, setDescription] = useState(product.description || "")
    const [price, setPrice] = useState(product.price)
    const [selectedCategory, setSelectedCategory] = useState<any>({
        id: String(product.categoryId),
        title: product.category?.title || "Категория",
    })

    // Convert backend subscription type to frontend format
    const getSubscriptionType = (): SubscriptionType | null => {
        if (!product.type || product.type.length === 0) return null
        const typeId = subscriptionTypeMap[product.type[0] as keyof typeof subscriptionTypeMap] || "key"
        return {
            id: typeId,
            title: typeId === "key" ? "Ключ" : typeId === "subscription" ? "Подписка" : "Аккаунт",
        }
    }

    // Convert backend license type to frontend format
    const getLicenseDuration = (): LicenseDuration | null => {
        const durationId = licenseDurationMap[product.licenseType as keyof typeof licenseDurationMap] || "perpetual"
        const titleMap: Record<string, string> = {
            perpetual: "Бессрочно",
            "1month": "1 месяц",
            "3months": "3 месяца",
            "6months": "6 месяцев",
            "1year": "1 год",
        }
        return {
            id: durationId,
            title: titleMap[durationId],
        }
    }

    const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<SubscriptionType | null>(
        getSubscriptionType(),
    )
    const [selectedLicenseDuration, setSelectedLicenseDuration] = useState<LicenseDuration | null>(getLicenseDuration())

    // Convert characteristics to the format expected by the form
    const [characteristics, setCharacteristics] = useState<{ title: string; value: string }[]>(
        product.characteristics?.map((char) => ({ title: char.title, value: char.value })) || [{ title: "", value: "" }],
    )

    // Convert distributives to the format expected by the form
    const [distributiveFiles, setDistributiveFiles] = useState<
        { file: File | null; displayName: string; fileUrl?: string }[]
    >(
        product.distributives?.map((dist) => ({ file: null, displayName: dist.displayName, fileUrl: dist.fileUrl })) || [
            { file: null, displayName: "" },
        ],
    )

    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

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

    const handleCategorySelect = (category: any) => {
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

        if (!image) {
            setError("Загрузите изображение товара")
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)
            setSuccess(null)

            const uploadedDistributives = []

            for (const distributive of distributiveFiles) {
                if ((distributive.file || distributive.fileUrl) && distributive.displayName) {
                    if (distributive.fileUrl) {
                        // Existing file
                        uploadedDistributives.push({
                            displayName: distributive.displayName,
                            fileUrl: distributive.fileUrl,
                        })
                    } else if (distributive.file) {
                        // New file
                        const timestamp = Date.now()
                        const fileName = distributive.file.name.replace(/\s+/g, "_")
                        const filePath = `/distributives/${timestamp}_${fileName}`

                        uploadedDistributives.push({
                            displayName: distributive.displayName,
                            fileUrl: filePath,
                        })
                    }
                }
            }

            const result = await updateProduct({
                id: product.id,
                name: title,
                price,
                photo: image,
                description,
                categoryId: Number.parseInt(selectedCategory.id),
                type: subscriptionTypeMap[selectedSubscriptionType.id as keyof typeof subscriptionTypeMap],
                licenseType: licenseDurationMap[selectedLicenseDuration.id as keyof typeof licenseDurationMap],
                characteristics: characteristics.filter((char) => char.title && char.value),
                distributives: uploadedDistributives,
            })

            if (result.success) {
                setSuccess("Товар успешно обновлен")
                // Reload the page after 1 second to show updated data
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } else {
                throw new Error(result.error || "Ошибка при обновлении товара")
            }
        } catch (error: any) {
            console.error("Error updating product:", error)
            setError(error.message || "Произошла ошибка при обновлении товара")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-[800px] pt-4 pb-7 px-6 bg-white rounded-[16px] max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[22px] font-bold text-[#161616]">Редактировать товар</h3>
                    <div onClick={onClose}>
                        <CrossLogo className="w-6 h-6 cursor-pointer" />
                    </div>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">{success}</div>
                )}

                <div className="flex flex-row gap-6">
                    {/* Левая колонка - основная информация */}
                    <div className="flex flex-col text-black gap-4 w-1/2">
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
                                    <Image src={image || "/placeholder.svg"} alt="Product image" fill style={{ objectFit: "cover" }} />
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
                        onClick={onClose}
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
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Сохранить"}
                    </button>
                </div>
            </form>
        </div>
    )
}
