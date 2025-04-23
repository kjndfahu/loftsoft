"use server"


import { revalidatePath } from "next/cache"
import {prisma} from "../../../prisma/prisma-client";

export async function createWithdrawRequest(data: {
    phone: number | string
    bank: string
    name: string
    sum: string
    userEmail: string
}) {
    try {
        // Преобразуем телефон в число, если он передан как строка
        const phoneNumber = typeof data.phone === "string" ? Number.parseInt(data.phone.replace(/\D/g, ""), 10) : data.phone

        // Проверяем, что телефон - это число
        if (isNaN(phoneNumber)) {
            return {
                success: false,
                error: "Номер телефона должен содержать только цифры",
            }
        }

        const withdrawRequest = await prisma.withdrawRequest.create({
            data: {
                phone: phoneNumber,
                bank: data.bank,
                name: data.name,
                sum: data.sum,
                userEmail: data.userEmail,
            },
        })

        revalidatePath("/profile")
        revalidatePath("/withdraw-requests")
        return { success: true, data: withdrawRequest }
    } catch (error) {
        console.error("Error creating withdraw request:", error)
        return { success: false, error: "Не удалось создать заявку на вывод" }
    }
}
