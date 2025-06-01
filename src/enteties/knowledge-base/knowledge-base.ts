"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../../../prisma/prisma-client"

export interface CategoryData {
    id: number
    name: string
    emoji: string
    order: number
}

interface Category {
    id: string;
    name: string;
    emoji?: string;
    order: number;
    articles: Article[];
}

interface ArticleData {
    title: string
    content: string
    categoryId: number
    order: number
    emoji?: string
}

interface GetCategoriesResponse {
    success: boolean;
    categories: Category[];
    error?: string;
}

// Function to create a new category
export async function createCategory(data: CategoryData) {
    try {
        // Validate required fields
        if (!data.name) {
            return { success: false, error: "Category name is required" }
        }

        // Create the category
        const category = await prisma.knowledgeBaseCategory.create({
            data: {
                name: data.name,
                emoji: data.emoji || "📄",
                order: data.order,
            },
        })

        revalidatePath("/admin-knowledge-base")
        return { success: true, category }
    } catch (error) {
        console.error("Error creating category:", error)
        return { success: false, error: "Failed to create category" }
    }
}

// Function to get all categories
export async function getCategories(): Promise<GetCategoriesResponse> {
    try {
        const categories = await prisma.knowledgeBaseCategory.findMany({
            orderBy: {
                order: "asc",
            },
            include: {
                articles: {
                    orderBy: {
                        order: "asc",
                    },
                    select: {
                        id: true,
                        title: true,
                        emoji: true,
                        order: true,
                    },
                },
            },
        });

        return { success: true, categories };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: "Failed to fetch categories", categories: [] };
    }
}

export async function updateCategoryOrder(id: number, newOrder: number) {
    try {
        await prisma.knowledgeBaseCategory.update({
            where: { id },
            data: { order: newOrder },
        })

        revalidatePath("/admin-knowledge-base")
        return { success: true }
    } catch (error) {
        console.error("Error updating category order:", error)
        return { success: false, error: "Failed to update category order" }
    }
}

export async function deleteCategory(id: number) {
    try {
        await prisma.knowledgeBaseCategory.delete({
            where: { id },
        })

        revalidatePath("/admin-knowledge-base")
        return { success: true }
    } catch (error) {
        console.error("Error deleting category:", error)
        return { success: false, error: "Failed to delete category" }
    }
}

export async function createArticle(data: ArticleData) {
    try {
        if (!data.title || !data.content || !data.categoryId) {
            return { success: false, error: "Title, content, and category are required" }
        }

        const article = await prisma.knowledgeBaseArticle.create({
            data: {
                title: data.title,
                content: data.content,
                emoji: data.emoji || "",
                order: data.order,
                categoryId: data.categoryId,
            },
        })

        revalidatePath("/admin-knowledge-base")
        revalidatePath(`/admin-knowledge-base/${article.id}`)
        return { success: true, article }
    } catch (error) {
        console.error("Error creating article:", error)
        return { success: false, error: "Failed to create article" }
    }
}

export async function getArticles() {
    try {
        const articles = await prisma.knowledgeBaseArticle.findMany({
            orderBy: {
                order: "asc",
            },
            select: {
                id: true,
                title: true,
                emoji: true,
                order: true,
                categoryId: true,
                content: true,
            },
        })

        return { success: true, articles }
    } catch (error) {
        console.error("Error fetching articles:", error)
        return { success: false, error: "Failed to fetch articles", articles: [] }
    }
}

export async function getArticleById(id: number) {
    try {
        const article = await prisma.knowledgeBaseArticle.findUnique({
            where: {
                id,
            },
            include: {
                category: true,
            },
        })

        if (!article) {
            return { success: false, error: "Article not found" }
        }

        return { success: true, article }
    } catch (error) {
        console.error("Error fetching article:", error)
        return { success: false, error: "Failed to fetch article" }
    }
}

export async function updateArticle(id: number, data: Partial<ArticleData>) {
    try {
        const article = await prisma.knowledgeBaseArticle.update({
            where: {
                id,
            },
            data: {
                title: data.title,
                content: data.content,
                emoji: data.emoji,
                order: data.order,
                categoryId: data.categoryId,
            },
        })

        revalidatePath("/admin-knowledge-base")
        revalidatePath(`/admin-knowledge-base/${id}`)
        return { success: true, article }
    } catch (error) {
        console.error("Error updating article:", error)
        return { success: false, error: "Failed to update article" }
    }
}

// Function to update article order
export async function updateArticleOrder(id: number, newOrder: number) {
    try {
        await prisma.knowledgeBaseArticle.update({
            where: { id },
            data: { order: newOrder },
        })

        revalidatePath("/admin-knowledge-base")
        return { success: true }
    } catch (error) {
        console.error("Error updating article order:", error)
        return { success: false, error: "Failed to update article order" }
    }
}

// Function to delete an article
export async function deleteArticle(id: number) {
    try {
        await prisma.knowledgeBaseArticle.delete({
            where: {
                id,
            },
        })

        revalidatePath("/admin-knowledge-base")
        return { success: true }
    } catch (error) {
        console.error("Error deleting article:", error)
        return { success: false, error: "Failed to delete article" }
    }
}

// Function to get next and previous articles
export async function getAdjacentArticles(id: number) {
    try {
        const currentArticle = await prisma.knowledgeBaseArticle.findUnique({
            where: { id },
            select: { categoryId: true, order: true },
        })

        if (!currentArticle) {
            return { success: false, error: "Article not found" }
        }

        // Get previous article in same category
        const prevArticle = await prisma.knowledgeBaseArticle.findFirst({
            where: {
                categoryId: currentArticle.categoryId,
                order: { lt: currentArticle.order },
            },
            orderBy: { order: "desc" },
            select: { id: true, title: true },
        })

        // Get next article in same category
        const nextArticle = await prisma.knowledgeBaseArticle.findFirst({
            where: {
                categoryId: currentArticle.categoryId,
                order: { gt: currentArticle.order },
            },
            orderBy: { order: "asc" },
            select: { id: true, title: true },
        })

        return { success: true, prevArticle, nextArticle }
    } catch (error) {
        console.error("Error fetching adjacent articles:", error)
        return { success: false, error: "Failed to fetch adjacent articles" }
    }
}

// Function to upload knowledge base media (images)
export async function uploadKnowledgeBaseMedia(formData: FormData) {
    try {
        const file = formData.get("file") as File
        const type = formData.get("type") as string | null

        // Validate file
        if (!file) {
            return { success: false, error: "No file provided" }
        }

        // Validate file type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"]
        const isImage = validImageTypes.includes(file.type)
        const isVideo = validVideoTypes.includes(file.type)

        if (!isImage && !isVideo) {
            return {
                success: false,
                error: "Invalid file type. Only images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, OGG) are allowed.",
            }
        }

        // Validate type field if provided
        if (type && !["image", "video"].includes(type)) {
            return { success: false, error: `Invalid type directive: ${type}. Use 'image' or 'video'.` }
        }

        // Cloudinary configuration
        const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
        const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

        if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
            return { success: false, error: "Cloudinary configuration is missing" }
        }

        // Prepare form data for Cloudinary
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)
        uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

        // Determine upload endpoint based on file type
        const uploadUrl = isImage ? CLOUDINARY_UPLOAD_URL : CLOUDINARY_UPLOAD_URL

        // Upload to Cloudinary
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: uploadFormData,
        })

        const data = await response.json()
        if (data.secure_url) {
            return { success: true, url: data.secure_url }
        } else {
            return {
                success: false,
                error: `Failed to upload ${isImage ? "image" : "video"} to Cloudinary: ${data.error?.message || "Unknown error"}`,
            }
        }
    } catch (error) {
        console.error("Error uploading media:", error)
        return {
            success: false,
            error: `Failed to upload media: ${error instanceof Error ? error.message : String(error)}`,
        }
    }
}
