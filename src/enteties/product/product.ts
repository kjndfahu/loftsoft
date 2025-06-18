"use server"

import { prisma } from "../../../prisma/prisma-client"

interface FindProduct {
    id: number
    name: string
    price: string
    photo: string
}

type QuestionAnswer = {
    id: number
    itemId: number
    question: string
    answer: string
    createdAt: Date
    updatedAt: Date
}

export interface Product {
    id: number
    name: string
    pricesByDuration: { durationId: string; price: string }[]
    photos: string[]
    description?: string | null
    categoryId?: number | null
    type: string[]
    licenseType: string[]
    deviceCounts: number[]
    createdAt: Date
    updatedAt: Date
    category?: { id: number; title: string } | null
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string; iconUrl?: string; logoUrl?: string }[]
    averageRating: number
    purchaseCount: number
    relatedProducts: Product[]
    reviews: { id: number; grade: number }[]
}

export async function fetchProduct(id: number): Promise<Product | null> {
    try {
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                characteristics: true,
                distributives: true,
                category: true,
                relatedProducts: {
                    include: {
                        category: true,
                    },
                },
                questions: true,
                reviews: {
                    select: {
                        id: true,
                        grade: true,
                    },
                },
            },
        })

        if (!item) {
            return null
        }

        const totalRating = item.reviews.reduce((sum, review) => sum + review.grade, 0)
        const averageRating = item.reviews.length > 0 ? totalRating / item.reviews.length : 0

        return {
            ...item,
            pricesByDuration: item.pricesByDuration || [],
            photos: item.photos || [],
            type: item.type || [],
            licenseType: item.licenseType || [],
            deviceCounts: item.deviceCounts || [],
            averageRating: Number(averageRating.toFixed(1)),
            purchaseCount: item.orderItems?.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0) || 0,
            reviews: item.reviews || [],
        }
    } catch (error) {
        console.error("Error fetching product:", error)
        return null
    }
}

interface CreateProductData {
    name: string
    pricesByDuration: { durationId: string; price: string }[]
    photos: string[]
    description?: string
    categoryId: number
    type: string[]
    licenseType: string[]
    deviceCounts: number[]
    characteristics?: { title: string; value: string }[]
    questions?: { question: string; answer: string }[]
    distributives?: { displayName: string; fileUrl: string; iconUrl?: string; logoUrl?: string }[]
    relatedProductIds?: number[]
    autorelease: boolean
}

export async function createProduct(data: CreateProductData) {
    try {
        // Validate required fields
        if (
            !data.name ||
            !data.pricesByDuration.length ||
            !data.photos.length ||
            !data.categoryId ||
            !data.type.length ||
            !data.licenseType.length ||
            !data.deviceCounts.length
        ) {
            return { success: false, error: "Missing required fields" }
        }

        // Validate photo URLs
        for (const photo of data.photos) {
            if (!isValidUrl(photo)) {
                return { success: false, error: `Invalid photo URL: ${photo}` }
            }
        }

        // Validate distributive URLs
        if (data.distributives) {
            for (const dist of data.distributives) {
                if (!isValidUrl(dist.fileUrl)) {
                    return { success: false, error: `Invalid file URL for distributive: ${dist.displayName}` }
                }
                if (dist.iconUrl && !isValidUrl(dist.iconUrl)) {
                    return { success: false, error: `Invalid icon URL for distributive: ${dist.displayName}` }
                }
                if (dist.logoUrl && !isValidUrl(dist.logoUrl)) {
                    return { success: false, error: `Invalid logo URL for distributive: ${dist.displayName}` }
                }
            }
        }

        // Validate pricesByDuration
        for (const price of data.pricesByDuration) {
            if (!price.durationId || !/^\d+(\.\d{1,2})?$/.test(price.price)) {
                return { success: false, error: `Invalid price format for duration ${price.durationId}: ${price.price}` }
            }
        }

        // Validate deviceCounts
        for (const count of data.deviceCounts) {
            if (!Number.isInteger(count) || count <= 0) {
                return { success: false, error: `Invalid device count: ${count}` }
            }
        }

        // Validate categoryId
        const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
        if (!category) {
            return { success: false, error: `Category with ID ${data.categoryId} does not exist` }
        }

        // Validate relatedProductIds
        if (data.relatedProductIds && data.relatedProductIds.length > 0) {
            const existingProducts = await prisma.item.findMany({
                where: { id: { in: data.relatedProductIds } },
                select: { id: true },
            })
            const existingIds = existingProducts.map((p) => p.id)
            const invalidIds = data.relatedProductIds.filter((id) => !existingIds.includes(id))
            if (invalidIds.length > 0) {
                return { success: false, error: `Invalid related product IDs: ${invalidIds.join(", ")}` }
            }
        }

        const product = await prisma.item.create({
            data: {
                name: data.name,
                pricesByDuration: data.pricesByDuration,
                photos: data.photos,
                description: data.description || "",
                categoryId: data.categoryId,
                type: data.type,
                licenseType: data.licenseType,
                deviceCounts: data.deviceCounts,
                autorelease: data.autorelease,
                characteristics: {
                    create: data.characteristics?.map((char) => ({
                        title: char.title,
                        value: char.value,
                    })) || [],
                },
                questions: {
                    create: data.questions?.map((qa) => ({
                        question: qa.question,
                        answer: qa.answer,
                    })) || [],
                },
                distributives: {
                    create: data.distributives?.map((dist) => ({
                        displayName: dist.displayName,
                        fileUrl: dist.fileUrl,
                        iconUrl: dist.iconUrl,
                        logoUrl: dist.logoUrl,
                    })) || [],
                },
                relatedProducts: {
                    connect: data.relatedProductIds?.map((id) => ({ id })) || [],
                },
            },
            include: {
                characteristics: true,
                questions: true,
                distributives: true,
                category: true,
                relatedProducts: {
                    include: {
                        category: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
                        grade: true,
                    },
                },
            },
        })

        const totalRating = product.reviews.reduce((sum, review) => sum + review.grade, 0)
        const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0

        return {
            success: true,
            product: {
                ...product,
                averageRating: Number(averageRating.toFixed(1)),
                purchaseCount: 0, // New product, no purchases yet
                reviews: product.reviews || [],
            },
        }
    } catch (error: any) {
        console.error("Error creating product:", error)
        if (error.code === "P2002") {
            return { success: false, error: "Product creation failed: Unique constraint violation" }
        }
        return { success: false, error: `Failed to create product: ${error.message}` }
    }
}

export async function findProducts(searchTerm: string) {
    try {
        const products = await prisma.item.findMany({
            where: {
                name: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                name: true,
                pricesByDuration: true,
                photos: true,
            },
        })

        return products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.pricesByDuration[0]?.price || "0",
            photo: product.photos[0] || "",
        }))
    } catch (error) {
        console.error("Error finding products:", error)
        return []
    }
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export async function uploadDistributiveFile(formData: FormData) {
    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error uploading distributive file:", error)
        return { success: false, error: "Failed to upload distributive file" }
    }
}

export async function getProductsByCategory(categoryId?: number | null) {
    try {
        const products = await prisma.item.findMany({
            where: categoryId !== undefined && categoryId !== null ? { categoryId } : {},
            include: {
                category: true,
                characteristics: true,
                distributives: true,
                reviews: {
                    select: {
                        id: true,
                        grade: true,
                    },
                },
                orderItems: {
                    select: {
                        quantity: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const productsWithStats = products.map((product) => {
            const reviews = Array.isArray(product.reviews) ? product.reviews : []
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0)
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0
            const purchaseCount = product.orderItems.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0)

            return {
                ...product,
                pricesByDuration: product.pricesByDuration || [],
                photos: product.photos || [],
                type: product.type || [],
                licenseType: product.licenseType || [],
                deviceCounts: product.deviceCounts || [],
                averageRating: Number(averageRating.toFixed(1)) || 0,
                purchaseCount,
                reviews: product.reviews || [],
            }
        })

        return { success: true, products: productsWithStats }
    } catch (error) {
        console.error("Error fetching products by category:", error)
        return { success: false, error: "Error fetching products", products: [] }
    }
}

export async function getSortedProducts(categoryId: number | null, filter: string) {
    try {
        let orderBy: any = { createdAt: "desc" }
        switch (filter) {
            case "rating":
                orderBy = { reviews: { _count: "desc" } }
                break
            case "popularity":
                orderBy = { orderItems: { _count: "desc" } } // Fixed: Align with purchaseCount
                break
            case "purchases":
                orderBy = { orderItems: { _count: "desc" } }
                break
            case "price_asc":
                orderBy = { pricesByDuration: { _min: { price: "asc" } } } // Simplified
                break
            case "price_desc":
                orderBy = { pricesByDuration: { _max: { price: "desc" } } } // Simplified
                break
            default:
                orderBy = { createdAt: "desc" }
        }

        const products = await prisma.item.findMany({
            where: categoryId !== null ? { categoryId } : {},
            include: {
                category: true,
                characteristics: true,
                distributives: true,
                reviews: {
                    select: {
                        id: true,
                        grade: true,
                    },
                },
                orderItems: {
                    select: {
                        quantity: true,
                    },
                },
            },
            orderBy,
        })

        const productsWithStats = products.map((product) => {
            const reviews = Array.isArray(product.reviews) ? product.reviews : []
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0)
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0
            const purchaseCount = product.orderItems.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0)

            return {
                ...product,
                pricesByDuration: product.pricesByDuration || [],
                photos: product.photos || [],
                type: product.type || [],
                licenseType: product.licenseType || [],
                deviceCounts: product.deviceCounts || [],
                averageRating: Number(averageRating.toFixed(1)) || 0,
                purchaseCount,
                reviews: product.reviews || [],
            }
        })

        return { success: true, products: productsWithStats }
    } catch (error) {
        console.error("Error fetching sorted products:", error)
        return { success: false, error: "Error fetching products", products: [] }
    }
}

export async function getAllProducts() {
    try {
        const products = await prisma.item.findMany({
            include: {
                category: true,
                characteristics: true,
                distributives: true,
                reviews: {
                    select: {
                        id: true,
                        grade: true,
                    },
                },
                orderItems: {
                    select: {
                        quantity: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const productsWithStats = products.map((product) => {
            const reviews = Array.isArray(product.reviews) ? product.reviews : []
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0)
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0
            const purchaseCount = product.orderItems.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0)

            return {
                ...product,
                pricesByDuration: product.pricesByDuration || [],
                photos: product.photos || [],
                type: product.type || [],
                licenseType: product.licenseType || [],
                deviceCounts: product.deviceCounts || [],
                averageRating: Number(averageRating.toFixed(1)) || 0,
                purchaseCount,
                reviews: product.reviews || [],
            }
        })

        return { success: true, products: productsWithStats }
    } catch (error) {
        console.error("Error fetching all products:", error)
        return { success: false, error: "Error fetching products", products: [] }
    }
}

export async function searchProductsAndCategories(searchQuery: string) {
    try {
        if (!searchQuery || searchQuery.trim() === "") {
            return {
                success: true,
                products: [],
                categories: [],
            }
        }

        const products = await prisma.item.findMany({
            where: {
                OR: [
                    { name: { contains: searchQuery, mode: "insensitive" } },
                    { description: { contains: searchQuery, mode: "insensitive" } },
                ],
            },
            include: {
                category: true,
                characteristics: true,
                distributives: true,
                reviews: {
                    select: {
                        id: true,
                        grade: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        })

        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    { description: { contains: searchQuery, mode: "insensitive" } },
                ],
            },
            orderBy: {
                title: "asc",
            },
            take: 5,
        })

        const productsWithStats = products.map((product) => {
            const reviews = Array.isArray(product.reviews) ? product.reviews : []
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0)
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

            return {
                ...product,
                pricesByDuration: product.pricesByDuration || [],
                photos: product.photos || [],
                type: product.type || [],
                licenseType: product.licenseType || [],
                deviceCounts: product.deviceCounts || [],
                averageRating: Number(averageRating.toFixed(1)) || 0,
                purchaseCount: product.orderItems?.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0) || 0,
                reviews: product.reviews || [],
            }
        })

        return {
            success: true,
            products: productsWithStats,
            categories,
        }
    } catch (error) {
        console.error("Error searching products and categories:", error)
        return {
            success: false,
            error: "Error searching",
            products: [],
            categories: [],
        }
    }
}

export async function searchProducts(searchQuery: string) {
    try {
        if (!searchQuery || searchQuery.trim() === "") {
            return {
                success: true,
                products: [],
            }
        }

        const products = await prisma.item.findMany({
            where: {
                OR: [
                    { name: { contains: searchQuery, mode: "insensitive" } },
                    { description: { contains: searchQuery, mode: "insensitive" } },
                ],
            },
            select: {
                id: true,
                name: true,
                pricesByDuration: true,
                photos: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        })

        return {
            success: true,
            products: products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.pricesByDuration[0]?.price || "0",
                photo: product.photos[0] || "",
            })),
        }
    } catch (error) {
        console.error("Error searching products:", error)
        return {
            success: false,
            error: "Error searching products",
            products: [],
        }
    }
}