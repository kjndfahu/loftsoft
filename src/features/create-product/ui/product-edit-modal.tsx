"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CrossLogo } from "@/shared/icons";
import { UploadIcon, Plus, Loader2, X } from "lucide-react";
import { CategoryPopup } from "@/features/create-product/ui/category-popup";
import { SubscriptionTypePopup, type SubscriptionType } from "@/features/create-product/ui/subscription-type-popup";
import { LicenseDurationPopup, type LicenseDuration } from "@/features/create-product/ui/license-duration-popup";
import { CharacteristicItem } from "@/features/create-product/ui/characteristic-item";
import { FileUploadItem } from "@/features/create-product/ui/file-upload-item";
import { QuestionAnswerItem } from "@/features/create-product/ui/question-answer-item";
import { updateProduct } from "@/enteties/product/update-product";
import { findProducts } from "@/enteties/product/product";

interface Product {
    id: number;
    name: string;
    price: string;
    newPrice?: string;
    photo: string;
    description?: string;
    categoryId: number;
    type: string[];
    licenseType: string[];
    deviceCounts: number[];
    characteristics: { id: number; title: string; value: string }[];
    distributives: { id: number; displayName: string; fileUrl: string }[];
    questions: { id: number; question: string; answer: string }[];
    relatedProducts: { id: number; name: string; price: string; photo: string }[];
    category: { id: string; title: string };
    autorelease: boolean;
}

interface ProductEditModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const subscriptionTypeMap = {
    KEY: "key",
    SUBSCRIPTION: "subscription",
    ACCOUNT: "account",
} as const;

const licenseDurationMap = {
    PERPETUAL: "perpetual",
    ONE_MONTH: "1month",
    THREE_MONTHS: "3months",
    SIX_MONTHS: "6months",
    ONE_YEAR: "1year",
    TWO_YEARS: "2years",
    THREE_YEARS: "3years",
    FOUR_YEARS: "4years",
    FIVE_YEARS: "5years",
} as const;

const deviceCountOptions = [1, 2, 3, 4, 5];

export function ProductEditModal({ product, isOpen, onClose }: ProductEditModalProps) {
    const [image, setImage] = useState<string | null>(product.photo);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [title, setTitle] = useState(product.name);
    const [description, setDescription] = useState(product.description || "");
    const [price, setPrice] = useState(product.price);
    const [newPrice, setNewPrice] = useState(product.newPrice || "");
    const [selectedCategory, setSelectedCategory] = useState<any>({
        id: String(product.categoryId),
        title: product.category?.title || "Категория",
    });
    const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState<SubscriptionType[]>(
        product.type.map((t) => ({
            id: subscriptionTypeMap[t as keyof typeof subscriptionTypeMap],
            title: t === "KEY" ? "Ключ" : t === "SUBSCRIPTION" ? "Подписка" : "Аккаунт",
        })),
    );
    const [selectedLicenseDurations, setSelectedLicenseDurations] = useState<LicenseDuration[]>(
        product.licenseType.map((t) => {
            const durationId = licenseDurationMap[t as keyof typeof licenseDurationMap];
            const titleMap: Record<string, string> = {
                perpetual: "Бессрочно",
                "1month": "1 месяц",
                "3months": "3 месяца",
                "6months": "6 месяцев",
                "1year": "1 год",
                "2years": "2 года",
                "3years": "3 года",
                "4years": "4 года",
                "5years": "5 лет",
            };
            return { id: durationId, title: titleMap[durationId] };
        }),
    );
    const [selectedDeviceCounts, setSelectedDeviceCounts] = useState<number[]>(product.deviceCounts || []);
    const [characteristics, setCharacteristics] = useState<{ title: string; value: string }[]>(
        product.characteristics?.map((char) => ({ title: char.title, value: char.value })) || [
            { title: "", value: "" },
        ],
    );
    const [questions, setQuestions] = useState<{ question: string; answer: string }[]>(
        product.questions?.map((qa) => ({ question: qa.question, answer: qa.answer })) || [
            { question: "", answer: "" },
        ],
    );
    const [distributiveFiles, setDistributiveFiles] = useState<
        { file: File | null; displayName: string; fileUrl?: string }[]
    >(
        product.distributives?.map((dist) => ({
            file: null,
            displayName: dist.displayName,
            fileUrl: dist.fileUrl,
        })) || [{ file: null, displayName: "", fileUrl: "" }],
    );
    const [relatedProducts, setRelatedProducts] = useState<Product[]>(product.relatedProducts || []);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [autorelease, setAutorelease] = useState(product.autorelease || false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cloudinary configuration
    const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Fetch available products for related products selection
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
                if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_UPLOAD_URL) {
                    throw new Error("Cloudinary configuration is missing");
                }
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
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

    const handleCategorySelect = (category: any) => {
        setSelectedCategory(category);
    };

    const handleSubscriptionTypeSelect = (subscriptionType: SubscriptionType) => {
        setSelectedSubscriptionTypes((prev) =>
            prev.some((type) => type.id === subscriptionType.id)
                ? prev.filter((type) => type.id !== subscriptionType.id)
                : [...prev, subscriptionType],
        );
    };

    const handleLicenseDurationSelect = (duration: LicenseDuration) => {
        setSelectedLicenseDurations((prev) =>
            prev.some((d) => d.id === duration.id)
                ? prev.filter((d) => d.id !== duration.id)
                : [...prev, duration],
        );
    };

    const handleDeviceCountSelect = (count: number) => {
        setSelectedDeviceCounts((prev) =>
            prev.includes(count) ? prev.filter((c) => c !== count) : [...prev, count],
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

    const handleChangeFile = async (index: number, file: File | null, displayName: string) => {
        const newFiles = [...distributiveFiles];
        if (file) {
            try {
                const formData = new FormData();
                if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_UPLOAD_URL) {
                    throw new Error("Cloudinary configuration is missing");
                }
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                const response = await fetch(CLOUDINARY_UPLOAD_URL.replace("/image/upload", "/raw/upload"), {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                if (data.secure_url) {
                    newFiles[index] = { file, displayName, fileUrl: data.secure_url };
                    setDistributiveFiles(newFiles);
                } else {
                    setError("Ошибка при загрузке дистрибутива");
                }
            } catch (error) {
                console.error("Ошибка при загрузке дистрибутива:", error);
                setError("Не удалось загрузить дистрибутив");
            }
        } else {
            newFiles[index] = { file: null, displayName, fileUrl: newFiles[index].fileUrl || "" };
            setDistributiveFiles(newFiles);
        }
    };

    const handleRelatedProductSelect = (product: Product) => {
        if (relatedProducts.length >= 4) {
            setError("Можно выбрать только 4 связанных товара");
            return;
        }
        setRelatedProducts((prev) =>
            prev.some((p) => p.id === product.id)
                ? prev.filter((p) => p.id !== product.id)
                : [...prev, product],
        );
    };

    const handleRemoveRelatedProduct = (productId: number) => {
        setRelatedProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
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
            setSuccess(null);

            const uploadedDistributives = distributiveFiles
                .filter((dist) => dist.fileUrl && dist.displayName)
                .map((dist) => ({
                    displayName: dist.displayName,
                    fileUrl: dist.fileUrl!,
                }));

            const result = await updateProduct({
                id: product.id,
                name: title,
                price,
                newPrice: newPrice || undefined,
                photo: image,
                description,
                categoryId: Number.parseInt(selectedCategory.id),
                type: selectedSubscriptionTypes.map(
                    (type) => subscriptionTypeMap[type.id as keyof typeof subscriptionTypeMap] as TYPE,
                ),
                licenseType: selectedLicenseDurations.map(
                    (duration) => licenseDurationMap[duration.id as keyof typeof licenseDurationMap] as LicenseType,
                ),
                deviceCounts: selectedDeviceCounts,
                characteristics: characteristics.filter((char) => char.title && char.value),
                questions: questions.filter((q) => q.question && q.answer),
                distributives: uploadedDistributives,
                relatedProductIds: relatedProducts.map((p) => p.id),
                autorelease,
            });

            if (result.success) {
                setSuccess("Товар успешно обновлен");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error(result.error || "Ошибка при обновлении товара");
            }
        } catch (error: any) {
            console.error("Error updating product:", error);
            setError(error.message || "Произошла ошибка при обновлении товара");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

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

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                        {success}
                    </div>
                )}

                <div className="flex sml:flex-row flex-col gap-6">
                    {/* Left column - main information */}
                    <div className="flex flex-col gap-4 sml:w-1/2 w-full">
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
                                    <Image
                                        src={image}
                                        alt="Product image"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
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
                            <CategoryPopup
                                onSelect={handleCategorySelect}
                                selectedCategory={selectedCategory}
                            />
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
                            <SubscriptionTypePopup
                                onSelect={handleSubscriptionTypeSelect}
                                selectedTypes={selectedSubscriptionTypes}
                            />
                            <LicenseDurationPopup
                                onSelect={handleLicenseDurationSelect}
                                selectedDurations={selectedLicenseDurations}
                            />
                            <div className="flex flex-wrap gap-2">
                                <h4 className="text-[14px] font-semibold text-[#161616] w-full">
                                    Количество устройств:
                                </h4>
                                {deviceCountOptions.map((count) => (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => handleDeviceCountSelect(count)}
                                        className={`px-4 py-2 border-[1px] border-[#B9BCCB] rounded-[20px] ${
                                            selectedDeviceCounts.includes(count)
                                                ? "bg-[#161616] text-white"
                                                : "bg-white text-[#161616]"
                                        }`}
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

                    {/* Right column - characteristics, questions, distributives, and related products */}
                    <div className="flex flex-col gap-6 sml:w-1/2 w-full">
                        {/* Characteristics */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[16px] font-semibold text-[#161616]">
                                    Характеристики товара:
                                </h4>
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

                        {/* Questions and Answers */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[16px] font-semibold text-[#161616]">
                                    Вопросы и ответы:
                                </h4>
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

                        {/* Distributives */}
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

                        {/* Related Products */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[16px] font-semibold text-[#161616]">
                                    Связанные товары (до 4):
                                </h4>
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
                                                    className={`w-full text-left px-4 py-2 border-b-[1px] border-[#B9BCCB] last:border-b-0 ${
                                                        relatedProducts.some((p) => p.id === product.id)
                                                            ? "bg-[#161616] text-white"
                                                            : "bg-white text-[#161616]"
                                                    }`}
                                                    disabled={
                                                        relatedProducts.length >= 4 &&
                                                        !relatedProducts.some((p) => p.id === product.id)
                                                    }
                                                >
                                                    {product.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-[#161616]">
                                                Товары не найдены
                                            </div>
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
                                                <span className="text-[14px] text-[#161616]">
                                                    {product.name}
                                                </span>
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
    );
}