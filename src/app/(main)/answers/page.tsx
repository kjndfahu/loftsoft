"use client";

import { useState, useEffect } from "react";
import { BreadcrumbNav } from "@/shared/breadcrumb-nav";
import { getArticles, getCategories } from "@/enteties/knowledge-base/knowledge-base";
import { AnswersWrapper } from "@/features/answers/container/answers-wrapper";

export default function AnswersPage() {
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoriesData, articlesData] = await Promise.all([
                    getCategories(),
                    getArticles(),
                ]);

                setCategories(categoriesData.categories || []);
                setArticles(articlesData.articles || []);
            } catch (err) {
                setError("Ошибка при загрузке данных");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Ответы на вопросы" />
            <AnswersWrapper categories={categories} articles={articles} />
        </div>
    );
}