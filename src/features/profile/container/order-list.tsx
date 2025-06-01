"use client";

import { useEffect, useState, useCallback } from "react";
import { OrderBlock } from "@/features/profile/ui/order-block";
import { getUserOrders } from "@/enteties/orders/orders";
import { Order } from "@/kernel/types";
import Cookies from "js-cookie"; // Import js-cookie
import { useUser } from "@/enteties/auth/use-user";

export const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser(); // Get user from useUser hook
    const email = user?.email || Cookies.get("userEmail"); // Prioritize user.email, fallback to cookie

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!email) {
            setError("На данный момент у вас нет заказов :(");
            setLoading(false);
            return;
        }

        try {
            const response = await getUserOrders(email); // Pass email to getUserOrders
            if (response.success && response.orders) {
                setOrders(response.orders);
            } else {
                setError(response.error || "На данный момент у вас нет заказов :(");
            }
        } catch (err) {
            setError("На данный момент у вас нет заказов :(");
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) {
        return (
            <>
                <div className="animate-pulse w-full rounded-[16px] h-[157px] bg-[#F5F7FF]"></div>
                <div className="animate-pulse w-full rounded-[16px] h-[157px] bg-[#F5F7FF]"></div>
                <div className="animate-pulse w-full rounded-[16px] h-[157px] bg-[#F5F7FF]"></div>
            </>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-[#161616] flex-1 gap-4">
                <p className="text-[#161616]">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-[#161616] flex-1 gap-4">
            {orders.length === 0 ? (
                <p>На данный момент у вас нет заказов :(</p>
            ) : (
                orders.map((order) => <OrderBlock key={order.id} order={order} refetchOrders={fetchOrders} />)
            )}
        </div>
    );
};