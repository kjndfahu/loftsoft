export type ROLE = 'USER' | "ADMIN"

export type TYPE = "KEY" | "SUBSCRIPTION" | "ACCOUNT"

export type LicenseType = "PERPETUAL" | "ONE_MONTH" | "THREE_MONTHS" | "SIX_MONTHS" | "ONE_YEAR"

export interface OrderItem {
    id: number;
    orderId: number;
    itemId: number;
    type: string;
    quantity: number;
    price: number;
    oldPrice?: number;
    licenseType: string;
    deviceCount: number;
    name: string;
    photo?: string;
    createdAt: Date;
}

export interface Order {
    id: number;
    userId?: number;
    email?: string;
    totalAmount: number;
    status: string;
    adminResponse?: string;
    createdAt: Date;
    updatedAt: Date;
    text?: string;
    orderItems: OrderItem[];
}