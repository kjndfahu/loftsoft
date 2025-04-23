"use server"

import { cookies } from "next/headers"
import { prisma } from "../../../prisma/prisma-client"

export async function deleteAccount() {
    try {
        // Get current user from session
        const session = cookies().get("session")

        if (!session) {
            return { success: false, error: "Пользователь не авторизован" }
        }

        const { id } = JSON.parse(session.value) as { id: number; email: string }

        // Delete user from database
        await prisma.user.delete({
            where: { id },
        })

        // Clear session cookie
        cookies().delete("session")

        return { success: true }
    } catch (error) {
        console.error("Ошибка удаления аккаунта:", error)
        return { success: false, error: "Произошла ошибка при удалении аккаунта" }
    }
}
