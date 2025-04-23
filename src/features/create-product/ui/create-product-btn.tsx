'use client'

import {Plus} from "lucide-react";
import {useState} from "react";
import {Modal} from "@/shared/modal";
import {CreateProductForm} from "@/features/create-product/ui/create-product-form";

export const CreateProductBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            className="flex items-center justify-between text-black border-[1px] border-[#DBDEEF] rounded-[16px] py-[10px] px-[20px] w-[300px]">
            Создать товар
            <div onClick={() => setIsOpen(true)} className="border-[1px] cursor-pointer border-[#DBDEEF] rounded-full p-[5px]">
                <Plus/>
            </div>

            {isOpen && (
                <Modal form={ <CreateProductForm setIsOpen={setIsOpen}/> }/>
            )}
        </div>
    )
}