"use client";

import { useEffect, useState } from "react";
import { OrderBlock } from "@/features/profile/ui/order-block";
import { getUserOrders } from "@/enteties/orders/orders";
import { Order } from "@/kernel/types";
import { useUser } from "@/enteties/auth/use-user";

export const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null); // Reset error state before fetching

            // Only fetch if user and user.id exist
            if (!user || !user.id) {
                setError("User is not authenticated");
                setLoading(false);
                return;
            }

            try {
                const response = await getUserOrders(user.id);
                if (response.success && response.orders) {
                    setOrders(response.orders);
                } else {
                    setError(response.error || "Failed to load orders");
                }
            } catch (err) {
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]); // Re-run when user changes

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
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center text-[#161616] flex-1 gap-4">
            {orders.length === 0 ? (
                <p>На данный момент у вас нет заказов :(</p>
            ) : (
                orders.map((order) => <OrderBlock key={order.id} order={order} />)
            )}
        </div>
    );
};