"use server"



import {LicenseType, TYPE} from "@/kernel/types";
import {prisma} from "../../../prisma/prisma-client";

interface CreateProductData {
    name: string
    price: string
    photo: string
    description?: string
    categoryId: number
    type: TYPE
    licenseType: LicenseType
    characteristics?: { title: string; value: string }[]
    distributives?: { displayName: string; fileUrl: string }[]
}

// Function to create a new product
export async function createProduct(data: CreateProductData) {
    try {
        // Validate required fields
        if (!data.name || !data.price || !data.photo || !data.categoryId || !data.type || !data.licenseType) {
            return { success: false, error: "Missing required fields" }
        }

        // Create the product
        const product = await prisma.item.create({
            data: {
                name: data.name,
                price: data.price,
                photo: data.photo,
                description: data.description || "",
                categoryId: data.categoryId,
                type: [data.type],
                licenseType: data.licenseType,
                // Create characteristics if provided
                characteristics: {
                    create:
                        data.characteristics?.map((char) => ({
                            title: char.title,
                            value: char.value,
                        })) || [],
                },
                // Create distributives if provided
                distributives: {
                    create:
                        data.distributives?.map((dist) => ({
                            displayName: dist.displayName,
                            fileUrl: dist.fileUrl,
                        })) || [],
                },
            },
            include: {
                characteristics: true,
                distributives: true,
                category: true,
            },
        })

        return { success: true, product }
    } catch (error) {
        console.error("Error creating product:", error)
        return { success: false, error: "Failed to create product" }
    }
}

// Function to upload product image
export async function uploadProductImage(formData: FormData) {
    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error uploading product image:", error)
        return { success: false, error: "Failed to upload product image" }
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

// Existing functions from the provided file
export async function getProductsByCategory(categoryId?: number | null) {
    try {
        // If categoryId is not specified or is null, return all products
        if (categoryId === undefined || categoryId === null) {
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
        }

        // Otherwise filter by category
        const products = await prisma.item.findMany({
            where: {
                categoryId: categoryId,
            },
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
        console.error("Error fetching products by category:", error)
        return { success: false, error: "Error fetching products", products: [] }
    }
}

export async function getSortedProducts(categoryId?: number | null, sortBy = "price_asc") {
    try {
        let orderBy: any = {}

        // Define sorting parameters
        switch (sortBy) {
            case "price_asc":
                orderBy = { price: "asc" }
                break
            case "price_desc":
                orderBy = { price: "desc" }
                break
            // Add other sorting options here
            default:
                orderBy = { createdAt: "desc" }
        }

        // Form filtering condition
        const where = categoryId ? { categoryId } : {}

        const products = await prisma.item.findMany({
            where,
            include: {
                category: true,
                characteristics: true,
                distributives: true,
            },
            orderBy,
        })

        return { success: true, products }
    } catch (error) {
        console.error("Error fetching sorted products:", error)
        return { success: false, error: "Error fetching products", products: [] }
    }
}
