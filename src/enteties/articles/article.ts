"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../../../prisma/prisma-client"

// Interface for article creation
interface ArticleData {
    title: string
    photo: string
    content: string
}

// Function to create a new article
export async function createArticle(data: ArticleData) {
    try {
        // Validate required fields
        if (!data.title || !data.content) {
            return { success: false, error: "Title and content are required" }
        }

        // Create the article
        const article = await prisma.article.create({
            data: {
                title: data.title,
                photo: data.photo || "",
                text: data.content,
            },
        })

        revalidatePath("/admin-articles")
        return { success: true, article }
    } catch (error) {
        console.error("Error creating article:", error)
        return { success: false, error: "Failed to create article" }
    }
}

// Function to get all articles
export async function getArticles() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                photo: true,
                text: true,
                createdAt: true,
            },
        })

        return { success: true, articles }
    } catch (error) {
        console.error("Error fetching articles:", error)
        return { success: false, error: "Failed to fetch articles", articles: [] }
    }
}

// Function to get a single article by ID
export async function getArticleById(id: number) {
    try {
        const article = await prisma.article.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                photo: true,
                text: true,
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

// Function to update an article
export async function updateArticle(id: number, data: Partial<ArticleData>) {
    try {
        const article = await prisma.article.update({
            where: {
                id,
            },
            data: {
                title: data.title,
                photo: data.photo,
                text: data.content,
            },
        })

        revalidatePath("/admin-articles")
        revalidatePath(`/admin-articles/${id}`)
        return { success: true, article }
    } catch (error) {
        console.error("Error updating article:", error)
        return { success: false, error: "Failed to update article" }
    }
}

// Function to delete an article
export async function deleteArticle(id: number) {
    try {
        await prisma.article.delete({
            where: {
                id,
            },
        })

        revalidatePath("/admin-articles")
        return { success: true }
    } catch (error) {
        console.error("Error deleting article:", error)
        return { success: false, error: "Failed to delete article" }
    }
}

// Function to upload article media (images)
export async function uploadArticleMedia(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const type = formData.get("type") as string | null;

        // Validate file
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        // Validate file type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
        const isImage = validImageTypes.includes(file.type);
        const isVideo = validVideoTypes.includes(file.type);

        if (!isImage && !isVideo) {
            return { success: false, error: "Invalid file type. Only images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, OGG) are allowed." };
        }

        // Validate type field if provided
        if (type && !["image", "video"].includes(type)) {
            return { success: false, error: `Invalid type directive: ${type}. Use 'image' or 'video'.` };
        }

        // Cloudinary configuration
        const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
        const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
            return { success: false, error: "Cloudinary configuration is missing" };
        }

        // Prepare form data for Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        // Determine upload endpoint based on file type
        const uploadUrl = isImage ? CLOUDINARY_UPLOAD_URL : CLOUDINARY_UPLOAD_URL;

        // Upload to Cloudinary
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: uploadFormData,
        });

        const data = await response.json();
        if (data.secure_url) {
            return { success: true, url: data.secure_url };
        } else {
            return { success: false, error: `Failed to upload ${isImage ? "image" : "video"} to Cloudinary: ${data.error?.message || "Unknown error"}` };
        }
    } catch (error) {
        console.error("Error uploading media:", error);
        return { success: false, error: `Failed to upload media: ${error instanceof Error ? error.message : String(error)}` };
    }
}