'use client'

import {ThreeLines} from "@/shared/icons";
import {useState} from "react";
import {OpenSearchBar} from "@/features/header/ui/open-search-bar";

export const CatalogBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 justify-center cursor-pointer text-[16px] text-white py-3 px-6 bg-[#5069E8] rounded-full">
            <ThreeLines/>
            Каталог
            {isOpen && (
                <OpenSearchBar/>
            )}
        </div>
    )
}