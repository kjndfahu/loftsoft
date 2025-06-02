'use client'

import {HelpLogo} from "@/shared/icons";
import Link from "next/link";
import {useState} from "react";
import {Modal} from "@/shared/modal";
import {HelpModal} from "@/features/header/ui/help-popup";
import {Help} from "@/features/burger-menu/ui/help";

export const Sections = () => {
    const sectionsList = [
        {
            link: "about-us",
            text: "О магазине"
        },
        {
            link: "reviews",
            text: "Отзывы"
        },
        {
            link: "articles",
            text: "Статьи"
        },
        {
            link: "answers",
            text: "Ответы на вопросы"
        },
        ]

    const [isOpen, setIsOpen] = useState(false);
    console.log(isOpen)
    return (
        <div className="flex flex-col py-6 gap-3">
            <h2 className="font-normal text-[13px] leading-[17px] text-[#6A6B75]">Разделы</h2>
            <div className="flex flex-col gap-2">
                {sectionsList.map((section, index) => (
                    <Link href={`/${section.link}`} key={index}>
                        <p className="text-[18px] leading-6 text-[#161616] font-medium">{section.text}</p>
                    </Link>
                ))}
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-full gap-2 text-[16px] text-white font-semibold leading-4 h-[42px] bg-[#5069E8] mt-1">
                <HelpLogo color="#ffffff"/>
                Помощь
            </button>

            {isOpen && (
                <Modal setModalOpen={setIsOpen} form={ <Help/> }/>
            )}
        </div>
    )
}