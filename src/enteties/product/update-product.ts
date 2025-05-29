"use server"


import type { LicenseType, TYPE } from "@/kernel/types"
import {prisma} from "../../../prisma/prisma-client";

interface UpdateProductData {
    id: number
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

export async function updateProduct(data: UpdateProductData) {
    try {
        // Validate required fields
        if (!data.id || !data.name || !data.price || !data.photo || !data.categoryId || !data.type || !data.licenseType) {
            return { success: false, error: "Missing required fields" }
        }

        // Get existing product to compare changes
        const existingProduct = await prisma.item.findUnique({
            where: { id: data.id },
            include: {
                characteristics: true,
                distributives: true,
            },
        })

        if (!existingProduct) {
            return { success: false, error: "Product not found" }
        }

        // Update the product
        const updatedProduct = await prisma.item.update({
            where: { id: data.id },
            data: {
                name: data.name,
                price: data.price,
                photo: data.photo,
                description: data.description || "",
                categoryId: data.categoryId,
                type: [data.type],
                licenseType: data.licenseType,
            },
            include: {
                characteristics: true,
                distributives: true,
                category: true,
            },
        })

        // Handle characteristics update
        // First, delete all existing characteristics
        await prisma.characteristic.deleteMany({
            where: { itemId: data.id },
        })

        // Then create new ones
        if (data.characteristics && data.characteristics.length > 0) {
            await prisma.characteristic.createMany({
                data: data.characteristics.map((char) => ({
                    title: char.title,
                    value: char.value,
                    itemId: data.id,
                })),
            })
        }

        // Handle distributives update
        // First, delete all existing distributives
        await prisma.distributive.deleteMany({
            where: { itemId: data.id },
        })

        // Then create new ones
        if (data.distributives && data.distributives.length > 0) {
            await prisma.distributive.createMany({
                data: data.distributives.map((dist) => ({
                    displayName: dist.displayName,
                    fileUrl: dist.fileUrl,
                    itemId: data.id,
                })),
            })
        }

        return { success: true, product: updatedProduct }
    } catch (error) {
        console.error("Error updating product:", error)
        return { success: false, error: "Failed to update product" }
    }
}
