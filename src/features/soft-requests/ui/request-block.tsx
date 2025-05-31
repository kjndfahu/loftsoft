"use client"

import { useState } from "react";
import { Modal } from "@/shared/modal";
import { RequestAnswer } from "@/features/soft-requests/ui/request-answer";

export interface SoftRequest {
    id: string;
    name: string;
    email: string;
    program: string;
    comment: string;
    status: string;
    createdAt: Date;
}

interface RequestBlockProps {
    request: SoftRequest;
}

export const RequestBlock = ({ request }: RequestBlockProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            onClick={() => setIsOpen(true)}
            className="flex flex-col w-full border-[1px] p-5 cursor-pointer rounded-[20px] text-black gap-8"
        >
            <h2 className="font-semibold">Заявка номер #{request.id}</h2>
            <div className="flex flex-col gap-3">
                <p>
                    <span className="font-semibold">Имя:</span> {request.name}
                </p>
                <p>
                    <span className="font-semibold">Email:</span> {request.email}
                </p>
                <p>
                    <span className="font-semibold">Программа:</span> {request.program}
                </p>
                <p>
                    <span className="font-semibold">Статус:</span> {request.status}
                </p>
                <p>
                    <span className="font-semibold">Дата:</span> {new Date(request.createdAt).toLocaleDateString("ru-RU")}
                </p>
                <p>
                    <span className="font-semibold">Коментарий:</span> {request.comment}
                </p>
            </div>

            {isOpen && (
                <Modal
                    form={<RequestAnswer setIsOpen={setIsOpen} email={request.email} requestId={request.id} />}
                />
            )}
        </div>
    );
};