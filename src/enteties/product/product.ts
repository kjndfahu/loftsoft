"use server"

import { prisma } from "../../../prisma/prisma-client"

// Function to create a new product

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
    id: number;
    name: string;
    price: string;
    photo: string;
    description?: string | null;
    categoryId?: number | null;
    type: string[];
    licenseType: string;
    createdAt: Date;
    updatedAt: Date;
    category?: any;
    characteristics: any[];
    distributives: any[];
    averageRating: number; // Add averageRating
    purchaseCount: number; // Add purchaseCount
}

export async function findProducts(searchTerm: string): Promise<FindProduct[]> {
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
                price: true,
                photo: true,
            },
            take: 10,
        })
        return products
    } catch (error) {
        console.error("Error searching products:", error)
        return []
    }
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
                        grade: true,
                    },
                },
            },
        });

        if (!item) {
            return null;
        }

        // Calculate average rating
        const totalRating = item.reviews.reduce((sum, review) => sum + review.grade, 0);
        const averageRating = item.reviews.length > 0 ? totalRating / item.reviews.length : 0;
        const reviewCount = item.reviews.length;

        return {
            ...item,
            averageRating: Number(averageRating.toFixed(1)), // Round to 1 decimal place
            reviewCount,
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

interface CreateProductData {
    name: string
    price: string
    newPrice?: string
    photo: string
    description?: string
    categoryId: number
    type: string[]
    licenseType: string[]
    deviceCounts: number[]
    characteristics?: { title: string; value: string }[]
    questions?: { question: string; answer: string }[]
    distributives?: { displayName: string; fileUrl: string }[]
    relatedProductIds?: number[]
    autorelease: boolean
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export async function createProduct(data: CreateProductData) {
    try {
        // Validation of required fields
        if (
            !data.name ||
            !data.price ||
            !data.photo ||
            !data.categoryId ||
            !data.type.length ||
            !data.licenseType.length ||
            !data.deviceCounts.length
        ) {
            return { success: false, error: "Missing required fields" }
        }

        // Validate photo URL
        if (!isValidUrl(data.photo)) {
            return { success: false, error: "Invalid photo URL" }
        }

        // Validate distributive URLs and ensure they are GCS URLs
        if (data.distributives) {
            for (const dist of data.distributives) {
                if (!isValidUrl(dist.fileUrl)) {
                    return { success: false, error: `Invalid URL for distributive: ${dist.displayName}` }
                }
                // Validate that the URL is from the configured GCS bucket
                if (!dist.fileUrl.includes(`storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}`)) {
                    return { success: false, error: `Distributive URL must be from the configured GCS bucket: ${dist.displayName}` }
                }
            }
        }

        // Create product
        const product = await prisma.item.create({
            data: {
                name: data.name,
                price: data.price,
                newPrice: data.newPrice,
                photo: data.photo,
                description: data.description || "",
                categoryId: data.categoryId,
                type: data.type,
                licenseType: data.type,
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
                relatedProducts: true,
            },
        })

        return { success: true, product }
    } catch (error) {
        console.error("Error creating product:", error)
        return { success: false, error: "Failed to create product" }
    }
}

// Function to upload distributive file
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
        });

        const productsWithStats = products.map((product) => {
            const reviews = Array.isArray(product.reviews) ? product.reviews : [];
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
            const purchaseCount = product.orderItems.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0);

            return {
                ...product,
                averageRating: Number(averageRating.toFixed(1)) || 0,
                purchaseCount,
            };
        });

        return { success: true, products: productsWithStats };
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return { success: false, error: "Error fetching products", products: [] };
    }
}

export async function getSortedProducts(categoryId: number | null, filter: string) {
    try {
        let orderBy: any = { createdAt: "desc" };
        switch (filter) {
            case "rating":
                orderBy = { reviews: { _count: "desc" } };
                break;
            case "popularity":
                orderBy = { purchasedCount: "desc" };
                break;
            case "purchases":
                orderBy = { orderItems: { _count: "desc" } };
                break;
            case "price_asc":
                orderBy = { price: "asc" };
                break;
            case "price_desc":
                orderBy = { price: "desc" };
                break;
            default:
                orderBy = { createdAt: "desc" };
        }

        const products = await prisma.item.findMany({
            where: categoryId !== null ? { categoryId } : {},
            include: {
                category: true,
                characteristics: true,
                distributives: true,
                reviews: {
                    select: {
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
        });

        const productsWithStats = products.map((product) => {
            const reviews = Array.isArray(product.reviews) ? product.reviews : [];
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
            const purchaseCount = product.orderItems.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0);

            return {
                ...product,
                averageRating: Number(averageRating.toFixed(1)) || 0,
                purchaseCount,
            };
        });

        return { success: true, products: productsWithStats };
    } catch (error) {
        console.error("Error fetching sorted products:", error);
        return { success: false, error: "Error fetching products", products: [] };
    }
}

export async function getAllProducts() {
    try {
        const products = await prisma.item.findMany({
            include: {
                category: true,
                characteristics: true,
                distributives: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return { success: true, products }
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

        return {
            success: true,
            products,
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
                price: true,
                photo: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        })

        return {
            success: true,
            products,
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