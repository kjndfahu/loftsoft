"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/enteties/auth/auth-actions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


interface CreateOrderResponse {
    success: boolean;
    error?: string;
    orderId?: number;
}


interface OrderItem {
    id: number;
    itemId: number;
    quantity: number;
    price: number;
    oldPrice?: number | null;
    name: string;
    photo: string;
    type: string;
    licenseType: string;
    deviceCount: number;
    createdAt: Date;
}

interface Order {
    id: number;
    email: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    adminResponse?: string | null;
    orderItems: OrderItem[];
}

interface GetUserOrdersResponse {
    success: boolean;
    orders?: Order[];
    error?: string;
}

interface UpdateOrderTextResponse {
    success: boolean;
    error?: string;
}

export async function updateOrderText(
    orderId: number,
    text: string
): Promise<UpdateOrderTextResponse> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        if (!text) {
            return { success: false, error: "Text is required" };
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { userId: true, email: true },
        });

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        // Verify that the order belongs to the user
        if (order.userId !== user.id && order.email !== user.email) {
            return { success: false, error: "Unauthorized access to order" };
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { text },
        });

        revalidatePath("/profile/orders"); // Revalidate the orders page
        return { success: true };
    } catch (error) {
        console.error("Error updating order text:", error);
        return { success: false, error: "Failed to update order text" };
    } finally {
        await prisma.$disconnect();
    }
}

export const getUserOrders = async (email: string): Promise<GetUserOrdersResponse> => {
    try {
        // If no email is provided, return an error
        if (!email) {
            return {
                success: false,
                error: 'Email is required to fetch orders',
            };
        }

        // Fetch orders for the user by email, including related order items
        const orders = await prisma.order.findMany({
            where: {
                email, // Query by email instead of userId
            },
            include: {
                orderItems: {
                    include: {
                        item: {
                            select: {
                                id: true,
                                name: true,
                                photo: true, // Assuming Item model has a photo field
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Sort by creation date, newest first
            },
        });

        // Map the orders to match the Order type expected by the frontend
        const formattedOrders: Order[] = orders.map((order) => ({
            id: order.id,
            userId: order.userId ?? undefined,
            email: order.email ?? undefined,
            totalAmount: order.totalAmount,
            status: order.status,
            adminResponse: order.adminResponse ?? undefined,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            text: order.text ?? undefined,
            orderItems: order.orderItems.map((item) => ({
                id: item.id,
                orderId: item.orderId,
                itemId: item.itemId,
                type: item.type,
                quantity: item.quantity,
                price: item.price,
                oldPrice: item.oldPrice ?? undefined,
                licenseType: item.licenseType,
                deviceCount: item.deviceCount,
                name: item.item.name,
                photo: item.item.photo ?? undefined, // Assuming photo is optional in Item model
                createdAt: order.createdAt, // Use order's createdAt for simplicity, adjust if Item has its own
            })),
        }));

        return {
            success: true,
            orders: formattedOrders,
        };
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return {
            success: false,
            error: 'Failed to load orders',
        };
    } finally {
        await prisma.$disconnect();
    }
};



export type UpdateAdminResponseState = {
    success: boolean;
    errors?: {
        _errors?: string;
    };
};

export async function updateAdminResponse(
    prevState: UpdateAdminResponseState,
    formData: FormData
): Promise<UpdateAdminResponseState> {
    console.log("updateAdminResponse called with formData:", Object.fromEntries(formData));
    try {
        const orderId = parseInt(formData.get("orderId") as string);
        const adminResponse = formData.get("response") as string; // Changed from "adminResponse" to "response"

        if (isNaN(orderId)) {
            return { success: false, errors: { _errors: "Invalid order ID" } };
        }

        if (!adminResponse) {
            return { success: false, errors: { _errors: "Admin response is required" } };
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                adminResponse,
                status: "COMPLETED",
            },
        });

        console.log("Order updated successfully:", updatedOrder);
        revalidatePath("/admin-orders"); // Revalidate the orders page
        return { success: true };
    } catch (error) {
        console.error("Error updating admin response:", error);
        return {
            success: false,
            errors: { _errors: error instanceof Error ? error.message : "Failed to update admin response" },
        };
    } finally {
        await prisma.$disconnect();
    }
}

export async function createOrder(email: string, items: OrderItem[]): Promise<CreateOrderResponse> {
    try {
        if (!email) {
            throw new Error("Email is required");
        }

        if (!items || items.length === 0) {
            console.error("Items array is empty or invalid");
            throw new Error("Cart is empty");
        }

        // Validate that all items have licenseType and deviceCount
        for (const item of items) {
            if (!item.licenseType) {
                throw new Error(`License type is required for item: ${item.name}`);
            }
            if (item.deviceCount == null || item.deviceCount < 0) {
                throw new Error(`Device count is required and must be non-negative for item: ${item.name}`);
            }
        }

        console.log("Items in createOrder:", items);
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
        console.log("Calculated totalAmount:", totalAmount);

        const user = await getCurrentUser().catch(() => null);

        // Create the order
        const newOrder = await prisma.order.create({
            data: {
                userId: user?.id || null,
                email: email,
                totalAmount: totalAmount,
                status: "PENDING",
                orderItems: {
                    create: items.map((item) => ({
                        itemId: parseInt(item.id),
                        quantity: item.quantity,
                        price: item.price,
                        oldPrice: item.oldPrice || null,
                        type: item.type,
                        licenseType: item.licenseType,
                        deviceCount: item.deviceCount,
                    })),
                },
            },
        });

        // Referral cashback logic
        if (user?.referredById) {
            console.log("User has referredById:", user.referredById);
            const referrer = await prisma.user.findUnique({
                where: { id: user.referredById },
                include: { Referral: true },
            });

            if (referrer?.Referral) {
                console.log("Referrer found with Referral:", referrer.Referral);
                const referralPercent = referrer.Referral.percent || 0;
                const cashbackAmount = totalAmount * (referralPercent / 100);
                console.log("Calculated cashbackAmount:", cashbackAmount);

                try {
                    await prisma.referral.update({
                        where: { id: referrer.Referral.id },
                        data: {
                            totalCashback: {
                                increment: cashbackAmount,
                            },
                            totalReferrals: {
                                increment: 1,
                            },
                        },
                    });
                    console.log("Referral updated successfully");
                } catch (error) {
                    console.error("Error updating referral:", error);
                }
            } else {
                console.log("Referrer or referral record not found");
            }
        } else {
            console.log("User has no referredById");
        }

        revalidatePath("/cart");

        return { success: true, orderId: newOrder.id };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating order:", errorMessage, error);
        throw new Error(`Failed to create order: ${errorMessage}`);
    } finally {
        await prisma.$disconnect();
    }
}


export async function getAllOrders() {
    // Теперь фильтруем только оплаченные заказы (например, статус 'COMPLETED')
    const orders = await prisma.order.findMany({
        where: {
            status: 'COMPLETED',
        },
        select: {
            id: true,
            email: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            adminResponse: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })
    return orders
}