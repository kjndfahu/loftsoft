// features/knowledge-base/ui/knowledge-base-sidebar.tsx

"use client"

import { useState, useEffect } from "react"

interface Article {
    id: number
    title: string
    emoji?: string
    order: number
}

interface Category {
    id: number
    name: string
    emoji: string
    order: number
    articles: Article[]
}

interface KnowledgeBaseSidebarProps {
    categories: Category[]
    onCategorySelect?: (category: Category) => void
}

export const KnowledgeBaseSidebar = ({ categories, onCategorySelect }: KnowledgeBaseSidebarProps) => {
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({})
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // Устанавливаем первую категорию открытой и выбранной по умолчанию
    useEffect(() => {
        if (categories.length > 0) {
            setExpandedCategories({ [categories[0].id]: true })
            setSelectedCategory(categories[0])
            if (onCategorySelect) {
                onCategorySelect(categories[0])
            }
        }
    }, [categories, onCategorySelect])

    const toggleCategory = (category: Category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category.id]: !prev[category.id],
        }))
        setSelectedCategory(category)
        if (onCategorySelect) {
            onCategorySelect(category)
        }
    }

    return (
        <div className="w-full max-w-[250px] bg-white text-[#161616] rounded-lg h-fit">
            <h2 className="text-[16px] font-semibold text-[#858692] mb-3">База знаний</h2>
            <div className="space-y-2">
                {categories.map((category) => (
                    <div key={category.id} className="space-y-1">
                        <div
                            className={`flex items-center justify-between cursor-pointer border-[1px] rounded-full px-[18px] p-2 ${
                                selectedCategory?.id === category.id
                                    ? "border-[#858692] bg-gray-100"
                                    : "border-[#DBDEEF] hover:border-[#858692]"
                            }`}
                            onClick={() => toggleCategory(category)}
                        >
                            <div className="flex items-center space-x-2">
                                <span>{category.emoji}</span>
                                <span className="text-[16px] text-[#333438] font-medium">{category.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}