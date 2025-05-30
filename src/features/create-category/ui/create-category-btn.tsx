'use client'

import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateCategoryForm } from "@/features/create-category/ui/create-category-form"
import { Modal } from "@/shared/modal"
import { Category } from "@/features/home/ui/items-grid"

interface Props {
    onCategoryCreated: (category: Category) => void
}

export const CreateCategoryBtn = ({ onCategoryCreated }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div
            className="flex items-center justify-between text-black border-[1px] border-[#DBDEEF] rounded-[16px] sml:py-[10px] py-[5px] mds:px-[20px] sml:px-[10px] px-[5px] mds:w-[300px] sml:w-[250px] ">
            <p className="sml:flex hidden">Создать категорию</p>
            <div onClick={() => setIsOpen(true)} className="sml:border-[1px] border-0 cursor-pointer border-[#DBDEEF] rounded-full p-[5px]">
                <Plus />
            </div>

            {isOpen && (
                <Modal form={<CreateCategoryForm setIsOpen={setIsOpen} onCategoryCreated={onCategoryCreated} />} />
            )}
        </div>
    )
}