'use client';

import { CategoryData } from "@/enteties/knowledge-base/knowledge-base";

interface KnowledgeBaseWrapperProps {
    categories: CategoryData[];
    selectedCategory: CategoryData;
    onCategorySelect: (category: CategoryData) => void;
}

export const KnowledgeBase = ({ categories, selectedCategory, onCategorySelect }: KnowledgeBaseWrapperProps) => {
    return (
        <div className="flex flex-col items-start w-full gap-3">
            <h4 className="font-semibold text-[18px] text-[#858692]">База знаний</h4>
            <div className="flex sml:flex-col overflow-x-auto hide-scrollbar touch-action-pan-x items-start w-full gap-3">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onCategorySelect(category)}
                        className={`flex flex-row gap-2 h-[42px] items-center justify-center cursor-pointer font-medium md:text-[15px] text-[14px] text-[#333438] py-2 md:px-[18px] px-[14px] border-[1px] rounded-full hover:border-[#858692] ${
                            category.id === selectedCategory.id ? 'border-[#5069E8]' : 'border-[#DBDEEF]'
                        }`}
                    >
                        {category.emoji}
                        {category.name}
                    </div>
                ))}
            </div>
        </div>
    );
};