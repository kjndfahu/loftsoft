"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

interface CreateCategoryParams {
    title: string
    description: string
    photo: string
}

export async function createCategory(params: CreateCategoryParams) {
    try {
        const { title, description, photo } = params

        const existingCategory = await prisma.category.findUnique({
            where: { title },
        })

        if (existingCategory) {
            throw new Error("Категория с таким названием уже существует")
        }
        const newCategory = await prisma.category.create({
            data: {
                title,
                description,
                photo,
            },
        })
        revalidatePath("/categories")

        return newCategory
    } catch (error) {
        console.error("Error creating category:", error)
        throw error
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "desc" },
        })

        return categories
    } catch (error) {
        console.error("Error fetching categories:", error)
        throw error
    }
}
