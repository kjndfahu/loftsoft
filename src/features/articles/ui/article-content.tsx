"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {fetchPageById} from "@/enteties/gitbook-api";


export function ArticleContent({ pageId = "default-page-id" }) {
    const [article, setArticle] = useState<{
        id: string
        title: string
        description: string
        content: string
        updatedAt: string
        image: string | null
    } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadArticle() {
            try {
                setLoading(true)
                const data = await fetchPageById(pageId)
                setArticle(data)
                setError(null)
            } catch (err) {
                console.error("Ошибка при загрузке статьи:", err)
                setError("Не удалось загрузить статью. Пожалуйста, попробуйте позже.")
            } finally {
                setLoading(false)
            }
        }

        loadArticle()
    }, [pageId])

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
                <div className="h-[300px] bg-gray-200 rounded-md animate-pulse w-full"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="text-red-500 p-4 border border-red-300 rounded-md">{error}</div>
    }

    if (!article) {
        return <div className="text-center py-10">Статья не найдена</div>
    }

    return (
        <article className="bg-white rounded-lg overflow-hidden">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <div className="text-sm text-gray-500 mb-4">Обновлено: {article.updatedAt}</div>

            {article.image && (
                <div className="relative w-full h-[300px] mb-6">
                    <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            )}

            {article.description && <div className="text-lg text-gray-700 mb-6 italic">{article.description}</div>}

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
    )
}
