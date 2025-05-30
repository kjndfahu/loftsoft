"use server"

import type { LicenseType, TYPE } from "@/kernel/types";
import { prisma } from "../../../prisma/prisma-client";

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

interface UpdateProductData {
    id: number;
    name: string;
    price: string;
    newPrice?: string;
    photo: string;
    description?: string;
    categoryId: number;
    type: TYPE[];
    licenseType: LicenseType[];
    deviceCounts: number[];
    characteristics?: { title: string; value: string }[];
    questions?: { question: string; answer: string }[];
    distributives?: { displayName: string; fileUrl: string }[];
    relatedProductIds?: number[];
    autorelease?: boolean;
}

export async function updateProduct(data: UpdateProductData) {
    try {
        // Validate required fields
        if (
            !data.id ||
            !data.name ||
            !data.price ||
            !data.photo ||
            !data.categoryId ||
            !data.type.length ||
            !data.licenseType.length ||
            !data.deviceCounts.length
        ) {
            return { success: false, error: "Missing required fields" };
        }

        // Validate photo URL
        if (!isValidUrl(data.photo)) {
            return { success: false, error: "Invalid photo URL" };
        }

        // Validate distributives URLs
        if (data.distributives) {
            for (const dist of data.distributives) {
                if (!isValidUrl(dist.fileUrl)) {
                    return { success: false, error: `Invalid URL for distributive: ${dist.displayName}` };
                }
            }
        }

        // Get existing product to ensure it exists
        const existingProduct = await prisma.item.findUnique({
            where: { id: data.id },
            include: {
                characteristics: true,
                questions: true,
                distributives: true,
                relatedProducts: true,
            },
        });

        if (!existingProduct) {
            return { success: false, error: "Product not found" };
        }

        // Update the product
        const updatedProduct = await prisma.item.update({
            where: { id: data.id },
            data: {
                name: data.name,
                price: data.price,
                newPrice: data.newPrice,
                photo: data.photo,
                description: data.description || "",
                categoryId: data.categoryId,
                type: data.type,
                licenseType: data.licenseType,
                deviceCounts: data.deviceCounts,
                autorelease: data.autorelease || false,
                characteristics: {
                    deleteMany: {},
                    create: data.characteristics?.filter((char) => char.title && char.value).map((char) => ({
                        title: char.title,
                        value: char.value,
                    })) || [],
                },
                questions: {
                    deleteMany: {},
                    create: data.questions?.filter((qa) => qa.question && qa.answer).map((qa) => ({
                        question: qa.question,
                        answer: qa.answer,
                    })) || [],
                },
                distributives: {
                    deleteMany: {},
                    create: data.distributives?.filter((dist) => dist.displayName && dist.fileUrl).map((dist) => ({
                        displayName: dist.displayName,
                        fileUrl: dist.fileUrl,
                    })) || [],
                },
                relatedProducts: {
                    set: [],
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
        });

        return { success: true, product: updatedProduct };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error: "Failed to update product" };
    }
}