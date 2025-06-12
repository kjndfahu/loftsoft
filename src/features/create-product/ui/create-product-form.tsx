"use client";

import type React from "react";
import { CrossLogo } from "@/shared/icons";
import type { FC } from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadIcon, Plus, Loader2, X } from "lucide-react";
import { CategoryPopup } from "./category-popup";
import { SubscriptionTypePopup, type SubscriptionType } from "./subscription-type-popup";
import { LicenseDurationPopup, type LicenseDuration } from "./license-duration-popup";
import { CharacteristicItem } from "./characteristic-item";
import { FileUploadItem } from "./file-upload-item";
import { QuestionAnswerItem } from "./question-answer-item";
import { createProduct, findProducts } from "@/enteties/product/product";
import { DistributiveDetails } from "@/features/create-product/ui/distributive-item";

interface Props {
    setIsOpen: (arg: boolean) => void;
    refetchProducts: () => Promise<void>;
}

interface Category {
    id: string;
    title: string;
    description: string;
    photo: string;
    createdAt: Date;
}

interface Characteristic {
    title: string;
    value: string;
}

interface QuestionAnswer {
    question: string;
    answer: string;
}

interface DistributiveFile {
    displayName: string;
    fileUrl?: string;
    iconUrl?: string;
    logoUrl?: string;
    customName?: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    photo: string;
}

interface PriceByDuration {
    durationId: string;
    price: string;
}

const subscriptionTypeMap = {
    key: "KEY",
    subscription: "SUBSCRIPTION",
    account: "ACCOUNT",
} as const;

const licenseDurationMap = {
    "1month": "ONE_MONTH",
    "3months": "THREE_MONTHS",
    "6months": "SIX_MONTHS",
    "1year": "ONE_YEAR",
    "2years": "TWO_YEARS",
    "3years": "THREE_YEARS",
    "4years": "FOUR_YEARS",
    "5years": "FIVE_YEARS",
} as const;

export const CreateProductForm: FC<Props> = ({ setIsOpen, refetchProducts }) => {
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isHovering, setIsHovering] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pricesByDuration, setPricesByDuration] = useState<PriceByDuration[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState<SubscriptionType[]>([]);
    const [selectedLicenseDurations, setSelectedLicenseDurations] = useState<LicenseDuration[]>([]);
    const [deviceCounts, setDeviceCounts] = useState<string>("");
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([{ title: "", value: "" }]);
    const [questions, setQuestions] = useState<QuestionAnswer[]>([{ question: "", answer: "" }]);
    const [distributiveFiles, setDistributiveFiles] = useState<DistributiveFile[]>([{ displayName: "", fileUrl: "" }]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autorelease, setAutorelease] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await findProducts(searchTerm);
                setAvailableProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [searchTerm]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setImageFiles((prev) => [...prev, ...newFiles]);
            try {
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
                const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

                if (!uploadPreset || !uploadUrl) {
                    throw new Error("Cloudinary configuration is missing");
                }

                const uploadedUrls: string[] = [];
                for (const file of newFiles) {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", uploadPreset);

                    const response = await fetch(uploadUrl, {
                        method: "POST",
                        body: formData,
                    });

                    const data = await response.json();
                    if (data.secure_url) {
                        uploadedUrls.push(data.secure_url);
                    } else {
                        setError("Ошибка при загрузке изображения");
                    }
                }
                setImages((prev) => [...prev, ...uploadedUrls]);
            } catch (error) {
                console.error("Ошибка при загрузке изображения:", error);
                setError("Не удалось загрузить изображение");
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
    };

    const handleSubscriptionTypeSelect = (subscriptionType: SubscriptionType) => {
        setSelectedSubscriptionTypes((prev) =>
            prev.some((type) => type.id === subscriptionType.id)
                ? prev.filter((type) => type.id !== subscriptionType.id)
                : [...prev, subscriptionType]
        );
    };

    const handleLicenseDurationSelect = (duration: LicenseDuration) => {
        setSelectedLicenseDurations((prev) => {
            const isSelected = prev.some((d) => d.id === duration.id);
            let newDurations;
            if (isSelected) {
                newDurations = prev.filter((d) => d.id !== duration.id);
                setPricesByDuration((prevPrices) => prevPrices.filter((p) => p.durationId !== duration.id));
            } else {
                newDurations = [...prev, duration];
                setPricesByDuration((prevPrices) => [...prevPrices, { durationId: duration.id, price: "" }]);
            }
            return newDurations;
        });
    };

    const handlePriceByDurationChange = (durationId: string, price: string) => {
        setPricesByDuration((prev) =>
            prev.map((p) => (p.durationId === durationId ? { ...p, price } : p))
        );
    };

    const handleDeviceCountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeviceCounts(e.target.value);
    };

    const handleAddCharacteristic = () => {
        setCharacteristics([...characteristics, { title: "", value: "" }]);
    };

    const handleRemoveCharacteristic = (index: number) => {
        const newCharacteristics = [...characteristics];
        newCharacteristics.splice(index, 1);
        setCharacteristics(newCharacteristics);
    };

    const handleChangeCharacteristic = (index: number, title: string, value: string) => {
        const newCharacteristics = [...characteristics];
        newCharacteristics[index] = { title, value };
        setCharacteristics(newCharacteristics);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", answer: "" }]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleChangeQuestion = (index: number, question: string, answer: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = { question, answer };
        setQuestions(newQuestions);
    };

    const handleAddFile = () => {
        setDistributiveFiles([...distributiveFiles, { displayName: "", fileUrl: "" }]);
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = [...distributiveFiles];
        newFiles.splice(index, 1);
        setDistributiveFiles(newFiles);
    };

    const handleChangeFile = (index: number, displayName: string, fileUrl?: string) => {
        const newFiles = [...distributiveFiles];
        newFiles[index] = { ...newFiles[index], displayName, fileUrl };
        setDistributiveFiles(newFiles);
    };

    const handleUpdateDistributive = (index: number, displayName: string, iconUrl?: string, logoUrl?: string) => {
        const newFiles = [...distributiveFiles];
        newFiles[index] = { ...newFiles[index], customName: displayName, iconUrl, logoUrl };
        setDistributiveFiles(newFiles);
    };

    const handleRemoveDistributive = (index: number) => {
        const newFiles = [...distributiveFiles];
        newFiles.splice(index, 1);
        setDistributiveFiles(newFiles);
    };

    const handleRelatedProductSelect = (product: Product) => {
        if (relatedProducts.length >= 4) {
            setError("Можно выбрать только 4 связанных товара");
            return;
        }
        setRelatedProducts((prev) =>
            prev.some((p) => p.id === product.id)
                ? prev.filter((p) => p.id !== product.id)
                : [...prev, product]
        );
    };

    const handleRemoveRelatedProduct = (productId: number) => {
        setRelatedProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            setError("Введите название товара");
            return;
        }

        if (pricesByDuration.some((p) => !p.price)) {
            setError("Введите цену для каждого срока лицензии");
            return;
        }

        if (!selectedCategory) {
            setError("Выберите категорию товара");
            return;
        }

        if (selectedSubscriptionTypes.length === 0) {
            setError("Выберите хотя бы один тип подписки");
            return;
        }

        if (selectedLicenseDurations.length === 0) {
            setError("Выберите хотя бы один срок лицензии");
            return;
        }

        if (!images.length) {
            setError("Загрузите хотя бы одно изображение товара");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const parsedDeviceCounts = deviceCounts
                .split(",")
                .map((count) => parseInt(count.trim()))
                .filter((count) => !isNaN(count) && count > 0);

            if (parsedDeviceCounts.length === 0 && deviceCounts.trim() !== "") {
                throw new Error("Недопустимое количество устройств");
            }

            const uploadedDistributives = distributiveFiles
                .filter((dist) => dist.fileUrl && (dist.customName || dist.displayName))
                .map((dist) => ({
                    displayName: dist.customName || dist.displayName,
                    fileUrl: dist.fileUrl!,
                    iconUrl: dist.iconUrl,
                    logoUrl: dist.logoUrl,
                }));

            const result = await createProduct({
                name: title,
                pricesByDuration,
                photos: images,
                description,
                categoryId: Number.parseInt(selectedCategory.id),
                type: selectedSubscriptionTypes.map(
                    (type) => subscriptionTypeMap[type.id as keyof typeof subscriptionTypeMap]
                ),
                licenseType: selectedLicenseDurations.map(
                    (duration) => licenseDurationMap[duration.id as keyof typeof licenseDurationMap]
                ),
                deviceCounts: parsedDeviceCounts,
                characteristics: characteristics.filter((char) => char.title && char.value),
                questions: questions.filter((q) => q.question && q.answer),
                distributives: uploadedDistributives,
                relatedProductIds: relatedProducts.map((p) => p.id),
                autorelease,
            });

            if (result.success) {
                await refetchProducts();
                setIsOpen(false);
            } else {
                throw new Error(result.error || "Ошибка при создании товара");
            }
        } catch (error: any) {
            console.error("Error creating product:", error);
            setError(error.message || "Произошла ошибка при создании товара");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onClick={(e) => e.stopPropagation()}
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

            <div className="flex sml:flex-row flex-col gap-6">
                <div className="flex flex-col gap-4 sml:w-1/2 w-full">
                    <div className="flex flex-wrap gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative h-[150px] w-[150px] rounded-[16px] overflow-hidden"
                            >
                                <Image src={image} alt={`Product image ${index + 1}`} fill style={{ objectFit: "cover" }} />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full"
                                >
                                    <X className="w-4 h-4 text-[#161616]" />
                                </button>
                            </div>
                        ))}
                        <div
                            className={`relative h-[150px] w-[150px] rounded-[16px] overflow-hidden bg-[#B9BCCB] cursor-pointer transition-all duration-200 ${isHovering === images.length ? "bg-[#A4A8BA]" : ""} flex items-center justify-center`}
                            onClick={handleImageClick}
                            onMouseEnter={() => setIsHovering(images.length)}
                            onMouseLeave={() => setIsHovering(null)}
                        >
                            <div className="flex flex-col items-center justify-center text-white">
                                <UploadIcon className="w-10 h-10 mb-2" />
                                <p className="text-sm font-medium">Добавить изображение</p>
                                <p className="text-xs opacity-70 mt-1">Рекомендуемый размер: 424x133px</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                        </div>
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

                    <div className="flex flex-col gap-3">
                        <h4 className="text-[14px] font-semibold text-[#161616]">Цены по срокам лицензии:</h4>
                        {selectedLicenseDurations.map((duration) => (
                            <div key={duration.id} className="flex items-center gap-3">
                                <span className="w-[100px]">{duration.title}</span>
                                <input
                                    className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px] bg-transparent outline-0 text-[#161616]"
                                    placeholder="Цена"
                                    type="number"
                                    value={pricesByDuration.find((p) => p.durationId === duration.id)?.price || ""}
                                    onChange={(e) => handlePriceByDurationChange(duration.id, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <CategoryPopup onSelect={handleCategorySelect} selectedCategory={selectedCategory} />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-[14px] font-medium text-[#161616]">
                            Автовыпуск:
                            <input
                                type="checkbox"
                                checked={autorelease}
                                onChange={(e) => setAutorelease(e.target.checked)}
                                className="ml-2 h-5 w-5 text-[#161616] border-[#B9BCCB] rounded focus:ring-0"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3">
                        <SubscriptionTypePopup onSelect={handleSubscriptionTypeSelect} selectedTypes={selectedSubscriptionTypes} />
                        <LicenseDurationPopup onSelect={handleLicenseDurationSelect} selectedDurations={selectedLicenseDurations} />
                        <div className="flex items-center gap-3">
                            <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                                <input
                                    className="bg-transparent w-full outline-0 text-[#161616]"
                                    placeholder="Количество устройств (через запятую, например: 1,2,3)"
                                    type="text"
                                    value={deviceCounts}
                                    onChange={handleDeviceCountsChange}
                                />
                            </div>
                        </div>
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

                <div className="flex flex-col gap-6 sml:w-1/2 w-full">
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

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[16px] font-semibold text-[#161616]">Вопросы и ответы:</h4>
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                className="flex items-center gap-1 text-[14px] text-[#161616]"
                            >
                                <Plus className="w-4 h-4" /> Добавить
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {questions.map((qa, index) => (
                                <QuestionAnswerItem
                                    key={index}
                                    index={index}
                                    question={qa.question}
                                    answer={qa.answer}
                                    onChange={handleChangeQuestion}
                                    onRemove={handleRemoveQuestion}
                                />
                            ))}
                        </div>
                    </div>

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
                                <div key={index}>
                                    <FileUploadItem
                                        index={index}
                                        fileName={file.displayName}
                                        fileUrl={file.fileUrl}
                                        onChange={handleChangeFile}
                                        onRemove={handleRemoveFile}
                                    />
                                    {file.fileUrl && (
                                        <DistributiveDetails
                                            index={index}
                                            displayName={file.customName || file.displayName}
                                            fileUrl={file.fileUrl}
                                            logoUrl={file.logoUrl}
                                            onUpdate={handleUpdateDistributive}
                                            onRemove={handleRemoveDistributive}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[16px] font-semibold text-[#161616]">Связанные товары (до 4):</h4>
                        </div>
                        <div className="space-y-2">
                            <div className="px-[15px] py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
                                <input
                                    className="bg-transparent w-full outline-0 text-[#161616]"
                                    placeholder="Введите название товара"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {searchTerm && (
                                <div className="max-h-[150px] overflow-y-auto pr-2 border-[1px] border-[#B9BCCB] rounded-[10px]">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => handleRelatedProductSelect(product)}
                                                className={`w-full text-left px-4 py-2 border-b-[1px] border-[#B9BCCB] last:border-b-0 ${relatedProducts.some((p) => p.id === product.id) ? "bg-[#161616] text-white" : "bg-white text-[#161616]"}`}
                                                disabled={relatedProducts.length >= 4 && !relatedProducts.some((p) => p.id === product.id)}
                                            >
                                                {product.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-[#161616]">Товары не найдены</div>
                                    )}
                                </div>
                            )}
                            {relatedProducts.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {relatedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-2 px-3 py-1 bg-[#DBDEEF] rounded-full"
                                        >
                                            <span className="text-[14px] text-[#161616]">{product.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRelatedProduct(product.id)}
                                                className="text-[#161616]"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
    );
};