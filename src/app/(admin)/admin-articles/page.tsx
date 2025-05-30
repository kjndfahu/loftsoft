"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getArticles } from "@/enteties/articles/article";
import { CreateArticleBtn } from "@/features/admin-articles/ui/create-article-btn";

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const { articles } = await getArticles();
                setArticles(articles || []);
            } catch (err) {
                setError("Не удалось загрузить статьи");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
                <p className="text-red-500">Ошибка: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Статьи:</h1>
                <CreateArticleBtn />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {articles && articles.length > 0 ? (
                    articles.map((article) => (
                        <Link
                            href={`/admin-articles/${article.id}`}
                            key={article.id}
                            className="border border-[#DBDEEF] text-black rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-48 w-full">
                                {article.photo ? (
                                    article.photo.startsWith("data:") ? (
                                        <img
                                            src={article.photo || "/placeholder.svg"}
                                            alt={article.title}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <Image
                                            src={article.photo || "/placeholder.svg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )
                                ) : (
                                    <Image src="/article-preview.png" alt={article.title} fill className="object-cover" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg truncate">{article.title}</h3>
                                <p className="text-sm text-gray-500 mt-2">{""}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">Нет статей. Создайте первую статью!</div>
                )}
            </div>
        </div>
    );
}