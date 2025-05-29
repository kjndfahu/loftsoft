"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export const CreateArticleBtn = () => {
    const router = useRouter()

    const handleClick = () => {
        router.push("/admin-articles/create")
    }

    return (
        <div
            onClick={handleClick}
            className="flex items-center justify-between text-black border-[1px] border-[#DBDEEF] rounded-[16px] sml:py-[10px] py-[5px] mds:px-[20px] sml:px-[10px] px-[5px] mds:w-[300px] sml:w-[250px] cursor-pointer hover:bg-gray-50 transition-colors"
        >
            <p className="sml:flex hidden">Создать статью</p>
            <div className="sml:border-[1px] border-0 border-[#DBDEEF] rounded-full p-[5px]">
                <Plus />
            </div>
        </div>
    )
}
