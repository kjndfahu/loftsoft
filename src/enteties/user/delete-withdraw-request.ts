'use server'

import {prisma} from "../../../prisma/prisma-client";

export async function deleteWithdrawRequest(id: number) {
    try {
        await prisma.withdrawRequest.delete({
            where: {
                id,
            },
        })

        return { success: true }
    } catch (error) {
        console.error("Error deleting withdraw request:", error)
        return { success: false, error: "Не удалось удалить заявку на вывод" }
    }
}