"use client"

import { SearchLogo } from "@/shared/icons"
import {FC, useState} from "react"
import {SearchResults} from "@/features/header/ui/search-results";

interface Props{
    categories: {
        id: number;
        photo: string;
        title: string;
        description: string;
        createdAt: Date;
        updateAt: Date;
    }[];
}

export const SearchBar:FC<Props> = ({categories}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <div
                className="flex items-center justify-between mdbvp:w-[666px] md:w-[400px] w-[260px] border-[1px] border-[#DBDEEF] text-[16px] rounded-full py-3 md:px-6 px-3 relative z-50"
                onClick={() => setIsOpen(true)}
            >
                <input
                    placeholder="Искать тут.."
                    className="text-[#4E4F56] w-full outline-0"
                    type="text"
                    onFocus={() => setIsOpen(true)}
                />
                <SearchLogo />
            </div>

            <SearchResults categories={categories} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}
