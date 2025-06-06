"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/enteties/knowledge-base/knowledge-base";
import { KnowledgeBaseArticleEditor } from "@/features/knowledge-base/ui/knowledge-base-article-editor";

export default function CreateKnowledgeBaseArticlePage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { categories = [] } = await getCategories();
                setCategories(categories);
            } catch (err) {
                setError("Ошибка при загрузке категорий");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <h1 className="mds:text-[32px] text-[20px] text-black font-semibold mb-8">
                Создание статьи для базы знаний
            </h1>
            {categories.length === 0 ? (
                <div className="bg-white border border-[#DBDEEF] rounded-lg p-6">
                    <p className="text-gray-500">Нет категорий. Создайте категорию, прежде чем добавлять статьи.</p>
                </div>
            ) : (
                <KnowledgeBaseArticleEditor categories={categories} />
            )}
        </div>
    );
}