// /src/enteties/product/product.ts
"use server";

import { prisma } from "@/lib/prisma";

interface CreateProductData {
    name: string;
    pricesByDuration: { durationId: string; regularPrice: string; discountedPrice: string }[];
    photos: string[];
    description?: string;
    categoryId: number;
    type: string[];
    licenseType: string[];
    deviceCounts: number[];
    characteristics: { title: string; value: string }[];
    questions: { question: string; answer: string }[];
    distributives: { displayName: string; fileUrl: string; iconUrl?: string; logoUrl?: string }[];
    relatedProductIds: number[];
    autorelease: boolean;
}

interface Product {
    id: number;
    name: string;
    pricesByDuration: { durationId: string; price: string }[];
    photos: string[];
    description?: string | null;
    categoryId?: number | null;
    type: string[];
    licenseType: string[];
    createdAt: Date;
    updatedAt: Date;
    category?: { id: number; title: string; description: string; photo: string } | null;
    characteristics: { id: number; title: string; value: string }[];
    distributives: { id: number; displayName: string; fileUrl: string; iconUrl?: string; logoUrl?: string }[];
    averageRating: number;
    purchaseCount: number;
    deviceCounts: number[];
    questions: { id: number; question: string; answer: string }[];
    reviews: { id: number; grade: number }[];
    relatedProducts: { id: number; name: string; category: { title: string } }[];
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export async function createProduct(data: CreateProductData): Promise<{ success: boolean; error?: string }> {
    try {
        // Validate required fields
        if (
            !data.name ||
            !data.pricesByDuration.length ||
            !data.photos.length ||
            !data.categoryId ||
            !data.type.length ||
            !data.licenseType.length
        ) {
            console.error("Missing required fields:", {
                name: !!data.name,
                pricesByDuration: data.pricesByDuration.length,
                photos: data.photos.length,
                categoryId: !!data.categoryId,
                type: data.type.length,
                licenseType: data.licenseType.length,
            });
            return { success: false, error: "Missing required fields" };
        }

        // Validate URLs
        for (const photo of data.photos) {
            if (!isValidUrl(photo)) {
                console.error(`Invalid photo URL: ${photo}`);
                return { success: false, error: `Invalid photo URL: ${photo}` };
            }
        }

        if (data.distributives) {
            for (const dist of data.distributives) {
                if (!dist.displayName || !dist.fileUrl) {
                    console.error(`Missing fields for distributive:`, dist);
                    return { success: false, error: `Missing fields for distributive: ${dist.displayName || "unnamed"}` };
                }
                if (!isValidUrl(dist.fileUrl)) {
                    console.error(`Invalid file URL for distributive: ${dist.fileUrl}`);
                    return { success: false, error: `Invalid file URL for distributive: ${dist.displayName}` };
                }
                if (dist.iconUrl && !isValidUrl(dist.iconUrl)) {
                    console.error(`Invalid icon URL for distributive: ${dist.iconUrl}`);
                    return { success: false, error: `Invalid icon URL for distributive: ${dist.displayName}` };
                }
                if (dist.logoUrl && !isValidUrl(dist.logoUrl)) {
                    console.error(`Invalid logo URL for distributive: ${dist.logoUrl}`);
                    return { success: false, error: `Invalid logo URL for distributive: ${dist.displayName}` };
                }
            }
        }

        // Validate prices
        for (const price of data.pricesByDuration) {
            if (!price.durationId || isNaN(Number(price.regularPrice)) || isNaN(Number(price.discountedPrice))) {
                console.error(`Invalid price data:`, price);
                return { success: false, error: "Invalid price data for duration" };
            }
        }

        // Create product in Prisma
        await prisma.item.create({
            data: {
                name: data.name,
                photos: data.photos,
                description: data.description,
                categoryId: data.categoryId,
                type: data.type,
                licenseType: data.licenseType,
                deviceCounts: data.deviceCounts,
                autorelease: data.autorelease,
                pricesByDuration: {
                    create: data.pricesByDuration.map((p) => ({
                        durationId: p.durationId,
                        price: JSON.stringify({ regular: p.regularPrice, discounted: p.discountedPrice }),
                    })),
                },
                characteristics: {
                    create: data.characteristics.map((c) => ({
                        title: c.title,
                        value: c.value,
                    })),
                },
                questions: {
                    create: data.questions.map((q) => ({
                        question: q.question,
                        answer: q.answer,
                    })),
                },
                distributives: {
                    create: data.distributives.map((d) => ({
                        displayName: d.displayName,
                        fileUrl: d.fileUrl,
                        iconUrl: d.iconUrl,
                        logoUrl: d.logoUrl,
                    })),
                },
                relatedProducts: {
                    connect: data.relatedProductIds.map((id) => ({ id })),
                },
            },
        });

        console.log(`Product created successfully: ${data.name}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error creating product:", error.message, error.stack);
        return { success: false, error: `Failed to create product: ${error.message}` };
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
                    include: { category: true },
                },
                questions: true,
                reviews: {
                    select: { id: true, grade: true },
                },
            },
        });

        if (!item) {
            console.log(`Product not found for ID: ${id}`);
            return null;
        }

        const pricesByDuration = item.pricesByDuration.map((p) => {
            try {
                return {
                    durationId: p.durationId,
                    price: JSON.parse(p.price as string) || { regular: "0", discounted: "0" },
                };
            } catch (error) {
                console.error(`Failed to parse price for duration ${p.durationId}:`, error);
                return {
                    durationId: p.durationId,
                    price: { regular: "0", discounted: "0" },
                };
            }
        });

        const totalRating = item.reviews.reduce((sum, review) => sum + review.grade, 0);
        const averageRating = item.reviews.length > 0 ? totalRating / item.reviews.length : 0;

        return {
            id: item.id,
            name: item.name,
            pricesByDuration,
            photos: item.photos || [],
            description: item.description,
            categoryId: item.categoryId,
            type: item.type || [],
            licenseType: item.licenseType || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            category: item.category
                ? {
                    id: item.category.id,
                    title: item.category.title,
                    description: item.category.description,
                    photo: item.category.photo,
                    createdAt: item.category.createdAt,
                }
                : null,
            characteristics: item.characteristics,
            distributives: item.distributives,
            questions: item.questions,
            reviews: item.reviews,
            averageRating: Number(averageRating.toFixed(1)),
            purchaseCount: item.orderItems?.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0) || 0,
            deviceCounts: item.deviceCounts || [],
            relatedProducts: item.relatedProducts.map((rp) => ({
                id: rp.id,
                name: rp.name,
                category: { title: rp.category.title },
            })),
        };
    } catch (error: any) {
        console.error(`Error fetching product ${id}:`, error.message, error.stack);
        return null;
    }
}

export async function getProductsByCategory(categoryId: number | null): Promise<{
    success: boolean;
    products: Product[];
    error?: string;
}> {
    try {
        const items = await prisma.item.findMany({
            where: categoryId ? { categoryId } : {},
            include: {
                characteristics: true,
                distributives: true,
                category: true,
                relatedProducts: {
                    include: { category: true },
                },
                questions: true,
                reviews: {
                    select: { id: true, grade: true },
                },
            },
        });

        const products: Product[] = items.map((item) => {
            const pricesByDuration = item.pricesByDuration.map((p) => {
                try {
                    return {
                        durationId: p.durationId,
                        price: JSON.parse(p.price as string) || { regular: "0", discounted: "0" },
                    };
                } catch (error) {
                    console.error(`Failed to parse price for item ${item.id}:`, error);
                    return {
                        durationId: p.durationId,
                        price: { regular: "0", discounted: "0" },
                    };
                }
            });

            const totalRating = item.reviews.reduce((sum, review) => sum + review.grade, 0);
            const averageRating = item.reviews.length > 0 ? totalRating / item.reviews.length : 0;

            return {
                id: item.id,
                name: item.name,
                pricesByDuration,
                photos: item.photos || [],
                description: item.description,
                categoryId: item.categoryId,
                type: item.type || [],
                licenseType: item.licenseType || [],
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                category: item.category
                    ? {
                        id: item.category.id,
                        title: item.category.title,
                        description: item.category.description,
                        photo: item.category.photo,
                        createdAt: item.category.createdAt,
                    }
                    : null,
                characteristics: item.characteristics,
                distributives: item.distributives,
                questions: item.questions,
                reviews: item.reviews,
                averageRating: Number(averageRating.toFixed(1)),
                purchaseCount: item.orderItems?.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0) || 0,
                deviceCounts: item.deviceCounts || [],
                relatedProducts: item.relatedProducts.map((rp) => ({
                    id: rp.id,
                    name: rp.name,
                    category: { title: rp.category.title },
                })),
            };
        });

        return { success: true, products };
    } catch (error: any) {
        console.error("Error fetching products by category:", error.message, error.stack);
        return { success: false, products: [], error: `Failed to fetch products: ${error.message}` };
    }
}

export async function findProducts(searchTerm: string): Promise<Product[]> {
    try {
        const items = await prisma.item.findMany({
            where: {
                name: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            include: {
                characteristics: true,
                distributives: true,
                category: true,
                relatedProducts: {
                    include: { category: true },
                },
                questions: true,
                reviews: {
                    select: { id: true, grade: true },
                },
            },
        });

        const products: Product[] = items.map((item) => {
            const pricesByDuration = item.pricesByDuration.map((p) => {
                try {
                    return {
                        durationId: p.durationId,
                        price: JSON.parse(p.price as string) || { regular: "0", discounted: "0" },
                    };
                } catch (error) {
                    console.error(`Failed to parse price for item ${item.id}:`, error);
                    return {
                        durationId: p.durationId,
                        price: { regular: "0", discounted: "0" },
                    };
                }
            });

            const totalRating = item.reviews.reduce((sum, review) => sum + review.grade, 0);
            const averageRating = item.reviews.length > 0 ? totalRating / item.reviews.length : 0;

            return {
                id: item.id,
                name: item.name,
                pricesByDuration,
                photos: item.photos || [],
                description: item.description,
                categoryId: item.categoryId,
                type: item.type || [],
                licenseType: item.licenseType || [],
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                category: item.category
                    ? {
                        id: item.category.id,
                        title: item.category.title,
                        description: item.category.description,
                        photo: item.category.photo,
                        createdAt: item.category.createdAt,
                    }
                    : null,
                characteristics: item.characteristics,
                distributives: item.distributives,
                questions: item.questions,
                reviews: item.reviews,
                averageRating: Number(averageRating.toFixed(1)),
                purchaseCount: item.orderItems?.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0) || 0,
                deviceCounts: item.deviceCounts || [],
                relatedProducts: item.relatedProducts.map((rp) => ({
                    id: rp.id,
                    name: rp.name,
                    category: { title: rp.category.title },
                })),
            };
        });

        return products;
    } catch (error: any) {
        console.error("Error finding products:", error.message, error.stack);
        return [];
    }
}