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
import {uploadDistributive} from "@/enteties/auth/upload-distributive";


interface Props {
    setIsOpen: (arg: boolean) => void;
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
    file: File | null;
    displayName: string;
    fileUrl?: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    photo: string;
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

const deviceCountOptions = [1, 2, 3, 4, 5];

export const CreateProductForm: FC<Props> = ({ setIsOpen }) => {
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState<SubscriptionType[]>([]);
    const [selectedLicenseDurations, setSelectedLicenseDurations] = useState<LicenseDuration[]>([]);
    const [selectedDeviceCounts, setSelectedDeviceCounts] = useState<number[]>([]);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([{ title: "", value: "" }]);
    const [questions, setQuestions] = useState<QuestionAnswer[]>([{ question: "", answer: "" }]);
    const [distributiveFiles, setDistributiveFiles] = useState<DistributiveFile[]>([{ file: null, displayName: "", fileUrl: "" }]);
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
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            try {
                const formData = new FormData();
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
                const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

                if (!uploadPreset || !uploadUrl) {
                    throw new Error("Cloudinary configuration is missing");
                }

                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.secure_url) {
                    setImage(data.secure_url);
                } else {
                    setError("Ошибка при загрузке изображения");
                }
            } catch (error) {
                console.error("Ошибка при загрузке изображения:", error);
                setError("Не удалось загрузить изображение");
            }
        }
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
        setSelectedLicenseDurations((prev) =>
            prev.some((d) => d.id === duration.id)
                ? prev.filter((d) => d.id !== duration.id)
                : [...prev, duration]
        );
    };

    const handleDeviceCountSelect = (count: number) => {
        setSelectedDeviceCounts((prev) =>
            prev.includes(count) ? prev.filter((c) => c !== count) : [...prev, count]
        );
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
        setDistributiveFiles([...distributiveFiles, { file: null, displayName: "", fileUrl: "" }]);
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = [...distributiveFiles];
        newFiles.splice(index, 1);
        setDistributiveFiles(newFiles);
    };

    // const handleChangeFile = async (index: number, file: File | null, displayName: string) => {
    //     const newFiles = [...distributiveFiles];
    //     if (file) {
    //         if (!file.name.endsWith(".exe")) {
    //             setError("Только .exe файлы разрешены");
    //             return;
    //         }
    //
    //         try {
    //             console.log("Starting file upload:", file.name, "Size:", file.size);
    //             const formData = new FormData();
    //             formData.append("file", file);
    //             console.log("FormData prepared:", Array.from(formData.entries()));
    //
    //             const result = await Promise.race([
    //                 uploadDistributive(formData),
    //                 new Promise((_, reject) => {
    //                     setTimeout(() => reject(new Error("Upload timed out after 60 seconds")), 60_000);
    //                 }),
    //             ]);
    //             console.log("Upload result:", result);
    //
    //             if ("error" in result) {
    //                 throw new Error(result.error);
    //             }
    //
    //             newFiles[index] = { file, displayName, fileUrl: result.fileUrl };
    //             setDistributiveFiles(newFiles);
    //             console.log("File upload successful, updated state:", newFiles);
    //         } catch (error: any) {
    //             console.error("Ошибка при загрузке дистрибутива:", error);
    //             setError(error.message || "Не удалось загрузить дистрибутив");
    //         }
    //     } else {
    //         newFiles[index] = { file: null, displayName, fileUrl: "" };
    //         setDistributiveFiles(newFiles);
    //     }
    // };

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

        if (!price) {
            setError("Введите цену товара");
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

        if (selectedDeviceCounts.length === 0) {
            setError("Выберите хотя бы одно количество устройств");
            return;
        }

        if (!image) {
            setError("Загрузите изображение товара");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const uploadedDistributives = distributiveFiles
                .filter((dist) => dist.fileUrl && dist.displayName)
                .map((dist) => ({
                    displayName: dist.displayName,
                    fileUrl: dist.fileUrl!,
                }));

            const result = await createProduct({
                name: title,
                price,
                newPrice: newPrice || undefined,
                photo: image,
                description,
                categoryId: Number.parseInt(selectedCategory.id),
                type: selectedSubscriptionTypes.map(
                    (type) => subscriptionTypeMap[type.id as keyof typeof subscriptionTypeMap]
                ),
                licenseType: selectedLicenseDurations.map(
                    (duration) => licenseDurationMap[duration.id as keyof typeof licenseDurationMap]
                ),
                deviceCounts: selectedDeviceCounts,
                characteristics: characteristics.filter((char) => char.title && char.value),
                questions: questions.filter((q) => q.question && q.answer),
                distributives: uploadedDistributives,
                relatedProductIds: relatedProducts.map((p) => p.id),
                autorelease,
            });

            if (result.success) {
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
                    <div
                        className={`relative h-[250px] rounded-[16px] overflow-hidden ${image ? "" : "bg-[#B9BCCB]"} cursor-pointer transition-all duration-200 ${isHovering && !image ? "bg-[#A4A8BA]" : ""} flex items-center justify-center`}
                        onClick={handleImageClick}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {image ? (
                            <>
                                <Image src={image} alt="Product image" fill style={{ objectFit: "cover" }} />
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
                        <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                            <input
                                className="bg-transparent w-full outline-0 text-[#161616]"
                                placeholder="Новая цена (необязательно)"
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
                        </div>
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
                        <div className="flex flex-wrap gap-2">
                            <h4 className="text-[14px] font-semibold text-[#161616] w-full">Количество устройств:</h4>
                            {deviceCountOptions.map((count) => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => handleDeviceCountSelect(count)}
                                    className={`px-4 py-2 border-[1px] border-[#B9BCCB] rounded-[20px] ${selectedDeviceCounts.includes(count) ? "bg-[#161616] text-white" : "bg-white text-[#161616]"}`}
                                >
                                    {count}
                                </button>
                            ))}
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
                                <FileUploadItem
                                    key={index}
                                    index={index}
                                    fileName={file.displayName}
                                    // onChange={handleChangeFile}
                                    onRemove={handleRemoveFile}
                                />
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