"use server"


import { revalidatePath } from "next/cache"
import {prisma} from "../../../prisma/prisma-client";

export async function createWithdrawRequest(data: {
    phone: string;
    bank: string;
    name: string;
    sum: string;
    userEmail: string;
}) {
    try {
        const withdrawRequest = await prisma.withdrawRequest.create({
            data: {
                phone: data.phone,
                bank: data.bank,
                name: data.name,
                sum: data.sum,
                userEmail: data.userEmail,
            },
        });

        revalidatePath("/profile");
        revalidatePath("/withdraw-requests");
        return { success: true, data: withdrawRequest };
    } catch (error) {
        console.error("Error creating withdraw request:", error);
        return { success: false, error: "Не удалось создать заявку на вывод" };
    }
}
