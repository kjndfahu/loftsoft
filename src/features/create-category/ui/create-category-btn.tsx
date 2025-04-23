'use client'

import {Plus} from "lucide-react";
import {useState} from "react";
import {CreateCategoryForm} from "@/features/create-category/ui/create-category-form";
import {Modal} from "@/shared/modal";

export const CreateCategoryBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            className="flex items-center justify-between text-black border-[1px] border-[#DBDEEF] rounded-[16px] py-[10px] px-[20px] w-[300px]">
            Создать категорию
            <div onClick={() => setIsOpen(true)} className="border-[1px] cursor-pointer border-[#DBDEEF] rounded-full p-[5px]">
                <Plus/>
            </div>

            {isOpen && (
                <Modal form={ <CreateCategoryForm setIsOpen={setIsOpen}/> }/>
            )}
        </div>
    )
}