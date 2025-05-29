import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryData } from "@/enteties/knowledge-base/knowledge-base";
import { FC } from "react";

interface Props {
    categories: CategoryData[];
    selectedCategory: CategoryData;
    setSelectedCategory: (category: CategoryData) => void;
}

export const AnswersBtns: FC<Props> = ({ categories, selectedCategory, setSelectedCategory }) => {
    // Find current category index
    const currentIndex = categories.findIndex((cat) => cat.id === selectedCategory.id);
    // Calculate previous and next indices (circular navigation)
    const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
    const nextIndex = (currentIndex + 1) % categories.length;

    // Get previous and next category details
    const prevCategory = categories[prevIndex];
    const nextCategory = categories[nextIndex];

    return (
        <div className="flex sml:flex-row flex-col w-full gap-3 justify-between mt-6">
            <button
                onClick={() => setSelectedCategory(prevCategory)}
                className="flex items-center justify-between px-4 w-full h-[76px] text-[#161616] font-medium py-2 border-[#DBDEEF] border-[1px] rounded-[16px]"
            >
                <ChevronLeft />
                <div className="flex flex-col gap-1">
                    <p className="text-[#6A6B75] text-[14px]">Previous</p>
                    <h4 className="text-[15px]">{prevCategory.name}</h4>
                </div>
            </button>
            <button
                onClick={() => setSelectedCategory(nextCategory)}
                className="flex items-center justify-between px-4 w-full h-[76px] font-medium text-[15px] text-[#161616] py-2 border-[#DBDEEF] border-[1px] rounded-[16px]"
            >
                <div className="flex flex-col items-start gap-1">
                    <p className="text-[#6A6B75] text-[14px]">Next</p>
                    <h4 className="text-[15px]">{nextCategory.name}</h4>
                </div>
                <ChevronRight />
            </button>
        </div>
    );
};