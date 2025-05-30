"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getArticleById, getCategories } from "@/enteties/knowledge-base/knowledge-base";
import { KnowledgeBaseArticleEditor } from "@/features/knowledge-base/ui/knowledge-base-article-editor";

export default function EditKnowledgeBaseArticlePage() {
    const params = useParams();
    const id = Number(params.id);
    const [article, setArticle] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [articleData, categoriesData] = await Promise.all([
                    getArticleById(id),
                    getCategories(),
                ]);

                if (!articleData.article) {
                    setError("Статья не найдена");
                    return;
                }

                setArticle(articleData.article);
                setCategories(categoriesData.categories || []);
            } catch (err) {
                setError("Ошибка при загрузке данных");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <h1 className="mds:text-[32px] text-[20px] text-black font-semibold mb-8">
                Редактирование статьи
            </h1>
            <KnowledgeBaseArticleEditor
                categories={categories}
                article={article}
                isEdit={true}
            />
        </div>
    );
}