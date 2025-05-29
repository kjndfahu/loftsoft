'use client'

import {Top} from "@/features/header/ui/top";
import {UserBar} from "@/features/header/ui/user-bar";
import {SearchProvider} from "../search-context";

export const Header = () => {
    return (
        <div className="flex w-full z-[100] fixed flex-col">
            <SearchProvider>
                <Top/>
                <UserBar/>
            </SearchProvider>
        </div>
    )
}