"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "@/enteties/knowledge-base/knowledge-base";
import { CategoryEditor } from "@/features/knowledge-base/ui/category-editor";

// TypeScript interfaces for type safety
interface Article {
    id: string;
    title: string;
    emoji?: string;
    order: number;
}

interface Category {
    id: string;
    name: string;
    emoji?: string;
    order: number;
    articles: Article[];
}

export default function AdminKnowledgeBasePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            if (response.success) {
                setCategories(response.categories);
            } else {
                setError(response.error || "Ошибка при загрузке категорий");
            }
        } catch (err) {
            setError("Ошибка при загрузке категорий");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"
                    aria-label="Загрузка данных"
                ></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
                <button
                    onClick={() => fetchCategories()}
                    className="ml-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    aria-label="Повторить попытку загрузки"
                >
                    Повторить
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Управление базой знаний</h1>
                <Link
                    href="/admin-knowledge-base/create-article"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    aria-label="Создать новую статью"
                >
                    Создать статью
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 text-[#161616] gap-8">
                <div className="bg-white border border-[#DBDEEF] rounded-lg p-6">
                    <CategoryEditor categories={categories} onCategoryUpdate={fetchCategories} />
                </div>

                <div className="bg-white border border-[#DBDEEF] rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">Статьи по категориям</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-500">Нет категорий. Создайте категорию, чтобы добавить статьи.</p>
                    ) : (
                        <div className="space-y-6">
                            {categories.map((category) => (
                                <div key={category.id} className="space-y-3">
                                    <h3 className="text-lg font-medium flex items-center">
                                        <span className="mr-2">{category.emoji}</span>
                                        {category.name}
                                    </h3>
                                    {category.articles.length === 0 ? (
                                        <p className="text-gray-500 text-sm pl-6">
                                            Нет статей в этой категории.{" "}
                                            <Link
                                                href="/admin-knowledge-base/create-article"
                                                className="text-blue-600 hover:text-blue-800"
                                                aria-label={`Создать статью в категории ${category.name}`}
                                            >
                                                Создать статью
                                            </Link>
                                        </p>
                                    ) : (
                                        <ul className="space-y-2 sml:pl-6">
                                            {category.articles.map((article) => (
                                                <li
                                                    key={article.id}
                                                    className="flex sml:gap-0 gap-2 sml:flex-row flex-col sml:items-center justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        {article.emoji && <span className="mr-2">{article.emoji}</span>}
                                                        <span>{article.title}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/admin-knowledge-base/edit-article/${article.id}`}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                            aria-label={`Редактировать статью ${article.title}`}
                                                        >
                                                            Редактировать
                                                        </Link>
                                                        <Link
                                                            href={`/knowledge-base/${article.id}`}
                                                            className="text-sm text-gray-600 hover:text-gray-800"
                                                            target="_blank"
                                                            aria-label={`Просмотреть статью ${article.title}`}
                                                        >
                                                            Просмотр
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}