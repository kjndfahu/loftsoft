"use client";

import { useEffect, useState } from "react";
import { BreadcrumbNav } from "@/shared/breadcrumb-nav";
import { BigArticle } from "@/features/articles/ui/big-article";
import { Article } from "@/features/articles/ui/article";
import { getArticles } from "@/enteties/articles/article";

interface Article {
    id: number;
    title: string;
    text: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ArticlesResponse {
    success: boolean;
    articles?: Article[];
    error?: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const result: ArticlesResponse = await getArticles();
                if (result.success) {
                    setArticles(result.articles || []);
                } else {
                    console.error("Failed to fetch articles:", result.error);
                    setArticles([]);
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const featuredArticle = articles.length > 0 ? articles[0] : null;
    const restOfArticles = articles.length > 1 ? articles.slice(1) : [];

    return (
        <div className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] sml:gap-10 gap-6">
            <BreadcrumbNav title="Статьи" />

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <>
                    {featuredArticle ? (
                        <BigArticle article={featuredArticle} />
                    ) : (
                        <p className="text-gray-500">No featured article available.</p>
                    )}

                    {restOfArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                            {restOfArticles.map((article) => (
                                <Article key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        !loading && <p className="text-gray-500">No additional articles available.</p>
                    )}
                </>
            )}
        </div>
    );
}