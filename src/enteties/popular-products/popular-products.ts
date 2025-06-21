"use server"

import { prisma } from "../../../prisma/prisma-client";
import { Product } from "@/features/home/ui/items-grid";

export async function addPopularProduct(itemId: number, position = 0) {
    try {
        const product = await prisma.item.findUnique({
            where: { id: itemId },
        })

        if (!product) {
            return { success: false, error: "Product not found" }
        }

        const popularProduct = await prisma.popularProduct.create({
            data: {
                itemId,
                position,
            },
            include: {
                item: {
                    include: {
                        category: true,
                        pricesByDuration: true,
                        characteristics: true,
                        distributives: true,
                    },
                },
            },
        })

        return { success: true, popularProduct }
    } catch (error) {
        console.error("Error adding popular product:", error)
        return { success: false, error: "Failed to add popular product" }
    }
}

export async function updatePopularProduct(popularProductId: number, newItemId: number) {
    try {
        const product = await prisma.item.findUnique({
            where: { id: newItemId },
        })

        if (!product) {
            return { success: false, error: "Product not found" }
        }

        const updatedPopularProduct = await prisma.popularProduct.update({
            where: { id: popularProductId },
            data: {
                itemId: newItemId,
            },
            include: {
                item: {
                    include: {
                        category: true,
                        pricesByDuration: true,
                        characteristics: true,
                        distributives: true,
                    },
                },
            },
        })

        return { success: true, popularProduct: updatedPopularProduct }
    } catch (error) {
        console.error("Error updating popular product:", error)
        return { success: false, error: "Failed to update popular product" }
    }
}

export async function getPopularProducts() {
    try {
        const popularProducts = await prisma.popularProduct.findMany({
            include: {
                item: {
                    include: {
                        category: true,
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
                        pricesByDuration: true,
                        characteristics: true,
                        distributives: true,
                    },
                },
            },
            orderBy: {
                position: "asc",
            },
            take: 4,
        });

        const productsWithStats = popularProducts.map((popularProduct): { id: number; itemId: number; position: number; item: Product } => {
            const reviews = Array.isArray(popularProduct.item.reviews)
                ? popularProduct.item.reviews
                : [];
            const totalRating = reviews.reduce((sum, review) => sum + (review.grade || 0), 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
            const purchaseCount = popularProduct.item.orderItems.reduce(
                (sum, orderItem) => sum + (orderItem.quantity || 0),
                0
            );

            return {
                ...popularProduct,
                item: {
                    ...popularProduct.item,
                    pricesByDuration: popularProduct.item.pricesByDuration.map(p => ({
                        durationId: p.durationId,
                        price: JSON.parse(p.price as string) || { regular: "0", discounted: "0" }
                    })) || [],
                    photos: popularProduct.item.photos || [],
                    type: popularProduct.item.type || [],
                    licenseType: popularProduct.item.licenseType || [],
                    deviceCounts: popularProduct.item.deviceCounts || [],
                    characteristics: popularProduct.item.characteristics || [],
                    distributives: popularProduct.item.distributives || [],
                    averageRating: Number(averageRating.toFixed(1)) || 0,
                    purchaseCount,
                    category: popularProduct.item.category
                        ? {
                            id: popularProduct.item.category.id,
                            title: popularProduct.item.category.title,
                            photo: popularProduct.item.category.photo,
                            description: popularProduct.item.category.description,
                            createdAt: popularProduct.item.category.createdAt,
                            updateAt: popularProduct.item.category.updateAt,
                        }
                        : null,
                },
            };
        });

        return { success: true, popularProducts: productsWithStats };
    } catch (error) {
        console.error("Error fetching popular products:", error);
        return { success: false, error: "Failed to fetch popular products", popularProducts: [] };
    }
}

export async function removePopularProduct(id: number) {
    try {
        await prisma.popularProduct.delete({
            where: { id },
        })

        return { success: true }
    } catch (error) {
        console.error("Error removing popular product:", error)
        return { success: false, error: "Failed to remove popular product" }
    }
}

export async function updatePopularProductPosition(id: number, position: number) {
    try {
        const updatedPopularProduct = await prisma.popularProduct.update({
            where: { id },
            data: { position },
        })

        return { success: true, popularProduct: updatedPopularProduct }
    } catch (error) {
        console.error("Error updating popular product position:", error)
        return { success: false, error: "Failed to update popular product position" }
    }
}