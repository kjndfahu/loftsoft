// features/knowledge-base/ui/knowledge-base-wrapper.tsx

"use client"

import { useState, useEffect } from "react"
import { KnowledgeBaseSidebar } from "@/features/knowledge-base/ui/knowledge-base-sidebar"
import { ArticleContent } from "@/features/knowledge-base/ui/article-content"

interface Category {
    id: number
    name: string
    emoji: string
    order: number
    articles: {
        id: number
        title: string
        content: string
        emoji?: string
        order: number
    }[]
}

interface KnowledgeBaseWrapperProps {
    categories: Category[]
}

export const KnowledgeBaseWrapper = ({ categories }: KnowledgeBaseWrapperProps) => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)


    useEffect(() => {
        if (categories.length > 0) {
            setSelectedCategory(categories[0])
        }
    }, [categories])

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <KnowledgeBaseSidebar
                categories={categories}
                onCategorySelect={(category) => setSelectedCategory(category)}
            />

            <div className="flex-1 bg-white border border-[#DBDEEF] rounded-lg p-6">
                {selectedCategory ? (
                    <ArticleContent category={selectedCategory} />
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-medium mb-4">Добро пожаловать в базу знаний</h2>
                        <p className="text-gray-600 mb-6">
                            Выберите категорию из меню слева, чтобы увидеть статьи.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}