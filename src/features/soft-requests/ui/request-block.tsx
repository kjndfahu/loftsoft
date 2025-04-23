'use client'

import {useState} from "react";
import {Modal} from "@/shared/modal";
import {RequestAnswer} from "@/features/soft-requests/ui/request-answer";

export const RequestBlock = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div onClick={() => setIsOpen(true)} className="flex flex-col w-[32%] border-[1px] p-5 cursor-pointer rounded-[20px] text-black gap-8">
            <h2 className="font-semibold">Заявка номер #1</h2>
            <div className="flex flex-col gap-3">
                <p><span className="font-semibold">Имя:</span> Иван</p>
                <p><span className="font-semibold">Email:</span> ivan@gmail.com</p>
                <p><span className="font-semibold">Программа:</span> Figma</p>
                <p><span className="font-semibold">Коментарий:</span> Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry. Lorem
                    Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has survived
                    not only five centuries, but also the leap into electronic typesetting, remaining
                    essentially unchanged.</p>
            </div>

            {isOpen && (
                <Modal form={ <RequestAnswer setIsOpen={setIsOpen}/> }/>
            )}
        </div>
    )
}