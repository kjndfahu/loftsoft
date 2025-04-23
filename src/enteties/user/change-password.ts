"use server"

import { z } from "zod"
import { hash, compare } from "bcryptjs"
import { cookies } from "next/headers"
import { prisma } from "../../../prisma/prisma-client"

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Введите текущий пароль"),
        newPassword: z.string().min(8, "Минимум 8 символов"),
        confirmPassword: z.string().min(8, "Минимум 8 символов"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export async function changePassword(formData: ChangePasswordFormData) {
    try {
        const validatedData = changePasswordSchema.parse(formData)

        // Get current user from session
        const session = cookies().get("session")

        if (!session) {
            return { success: false, error: "Пользователь не авторизован" }
        }

        const { id } = JSON.parse(session.value) as { id: number; email: string }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id },
        })

        if (!user) {
            return { success: false, error: "Пользователь не найден" }
        }

        // Verify current password
        const passwordMatch = await compare(validatedData.currentPassword, user.password)

        if (!passwordMatch) {
            return { success: false, error: "Неверный текущий пароль" }
        }

        // Hash new password
        const hashedPassword = await hash(validatedData.newPassword, 10)

        // Update password in database
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        })

        return { success: true, message: "Пароль успешно изменен" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }
        console.error("Ошибка смены пароля:", error)
        return { success: false, error: "Произошла ошибка при смене пароля" }
    }
}
