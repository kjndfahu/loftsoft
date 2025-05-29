'use client';

import { KnowledgeBase } from "@/features/answers/ui/knowledge-base";
import { AnswersArticle } from "@/features/answers/ui/answers-article";
import { RightBlock } from "@/features/answers/ui/right-block";
import { AnswersBtns } from "@/features/answers/ui/answers-btns";
import { CategoryData } from "@/enteties/knowledge-base/knowledge-base";
import { FC, useState, useEffect, useRef } from "react";

interface Article {
    id: number;
    title: string;
    emoji: string;
    order: number;
    categoryId: number;
    content: string;
}

interface Props {
    categories: CategoryData[];
    articles: Article[];
}

export const AnswersWrapper: FC<Props> = ({ categories, articles }) => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryData>(
        categories.length > 0
            ? categories[0]
            : { id: 0, name: "О магазине", emoji: "👋", articles: [] }
    );
    const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredArticles = articles.filter(
        (article) => article.categoryId === selectedCategory.id
    );

    useEffect(() => {
        if (filteredArticles.length > 0 && activeArticleId === null) {
            setActiveArticleId(filteredArticles[0].id);
            console.log("Set initial activeArticleId to:", filteredArticles[0].id);
        } else if (filteredArticles.length === 0) {
            setActiveArticleId(null);
            console.log("No articles, set activeArticleId to null");
        }
        if (containerRef.current && activeArticleId === null) {
            containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            console.log("Reset scroll to top for category:", selectedCategory.id);
        }
    }, [selectedCategory, filteredArticles, activeArticleId]);

    return (
        <div className="flex sml:flex-row flex-col md:gap-10 gap-5">
            <div className="sml:w-1/4 w-full">
                <KnowledgeBase
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                />
            </div>
            <div className="md:w-2/4 sml:w-3/4 w-full">
                <AnswersArticle
                    categoryName={selectedCategory.name}
                    categoryEmoji={selectedCategory.emoji}
                    articles={filteredArticles}
                    containerRef={containerRef}
                />
                <div className="overflow-x-auto whitespace-nowrap pb-2">
                    <AnswersBtns
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </div>
            </div>
            <RightBlock
                articles={filteredArticles}
                activeArticleId={activeArticleId}
                setActiveArticleId={setActiveArticleId}
                containerRef={containerRef}
            />
        </div>
    );
};