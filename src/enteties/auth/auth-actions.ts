"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import {prisma} from "../../../prisma/prisma-client";
import {compare, hash} from "bcryptjs";

const loginSchema = z.object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(8, "Минимум 8 символов"),
})

const registerSchema = z
    .object({
        email: z.string().email("Некорректный email"),
        password: z.string().min(8, "Минимум 8 символов"),
        confirmPassword: z.string().min(8, "Минимум 8 символов"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
}


export async function register(formData: RegisterFormData) {
    try {
        const validatedData = registerSchema.parse(formData);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return { success: false, error: "Пользователь с таким email уже существует" };
        }

        const hashedPassword = await hash(validatedData.password, 10);
        let referredById: number | null = null;

        const refCookie = cookies().get("ref")?.value;
        if (refCookie) {
            const referrer = await prisma.user.findUnique({
                where: { referralCode: refCookie },
                select: { id: true },
            });
            if (referrer) {
                referredById = referrer.id;
            }
        }

        // Create the new user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                referralCode: generateReferralCode(),
                referredById: referredById,
                Referral: {
                    create: {
                        totalReferrals: 0,
                        percent: 3,
                        totalCashback: 0,
                    },
                },
            },
        });


        if (referredById) {
            await prisma.referral.upsert({
                where: { userId: referredById },
                update: {
                    totalReferrals: { increment: 1 },
                    totalCashback: { increment: 0 }
                },
                create: {
                    userId: referredById,
                    totalReferrals: 1,
                    percent: 3,
                    totalCashback: 0,
                },
            });
        }

        cookies().set("session", JSON.stringify({ id: user.id, email: user.email }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message };
        }
        console.error("Ошибка регистрации:", error);
        return { success: false, error: "Произошла ошибка при регистрации" };
    }
}

export async function login(formData: LoginFormData) {
    try {
        const validatedData = loginSchema.parse(formData)

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (!user) {
            return { success: false, error: "Неверный email или пароль" }
        }

        const passwordMatch = await compare(validatedData.password, user.password)

        if (!passwordMatch) {
            return { success: false, error: "Неверный email или пароль" }
        }

        cookies().set("session", JSON.stringify({ id: user.id, email: user.email }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }
        console.error("Ошибка входа:", error)
        return { success: false, error: "Произошла ошибка при входе" }
    }
}

export async function logout() {
    cookies().delete("session")
    redirect("/")
}

export async function getCurrentUser() {
    const session = cookies().get("session")

    if (!session) {
        return null
    }

    try {
        const { id } = JSON.parse(session.value) as { id: number; email: string }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, role: true, referralCode: true, referredById: true, },
        })

        return user
    } catch {
        return null
    }
}
