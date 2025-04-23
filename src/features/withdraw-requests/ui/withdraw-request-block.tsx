"use client"

import { CrossLogo } from "@/shared/icons"

import { useState } from "react"
import {deleteWithdrawRequest} from "@/enteties/user/delete-withdraw-request";

interface WithdrawRequestProps {
    id: number
    email: string | null
    name: string
    bank: string
    phone: number
    sum: string
    index: number
}

export const WithdrawRequestBlock = ({ id, email, name, bank, phone, sum, index }: WithdrawRequestProps) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        const confirmed = window.confirm("Вы действительно хотите удалить заявку?")

        if (confirmed) {
            setIsDeleting(true)
            try {
                const result = await deleteWithdrawRequest(id)
                if (!result.success) {
                    alert("Ошибка при удалении заявки")
                }
            } catch (error) {
                console.error("Error deleting withdraw request:", error)
                alert("Произошла ошибка при удалении заявки")
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className="flex flex-col border-[1px] p-5 rounded-[20px] text-black gap-8">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Заявка номер #{index + 1}</h2>
                <div onClick={handleDelete} className={`cursor-pointer ${isDeleting ? "opacity-50" : ""}`}>
                    <CrossLogo />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <p>
                    <span className="font-semibold">Email:</span> {email || "Не указан"}
                </p>
                <p>
                    <span className="font-semibold">Имя:</span> {name}
                </p>
                <p>
                    <span className="font-semibold">Банк:</span> {bank}
                </p>
                <p>
                    <span className="font-semibold">Номер телефона:</span> +{phone}
                </p>
                <p>
                    <span className="font-semibold">Сумма:</span> {sum}
                </p>
            </div>
        </div>
    )
}
