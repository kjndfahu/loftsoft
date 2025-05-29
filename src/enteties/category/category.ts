"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

interface CreateCategoryParams {
    title: string
    description: string
    photo: string
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}


export async function createCategory(params: CreateCategoryParams) {
    try {
        const { title, description, photo } = params

        // Validate required fields
        if (!title || !description || !photo) {
            throw new Error("Все поля обязательны")
        }

        // Validate photo URL
        if (!isValidUrl(photo)) {
            throw new Error("Недействительный URL изображения")
        }

        // Check for existing category
        const existingCategory = await prisma.category.findUnique({
            where: { title },
        })

        if (existingCategory) {
            throw new Error("Категория с таким названием уже существует")
        }

        // Create new category
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

export async function  getCategories() {
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
