"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/enteties/orders/orders"; // Assuming this can be used client-side

import { Loader2 } from "lucide-react";
import AdminResponseForm from "@/features/admin-orders/ui/admin-response-form";


interface Order {
    id: number;
    email: string | null;
    totalAmount: number;
    status: string;
    createdAt: string;
    adminResponse: string | null;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const ordersData = await getAllOrders(); // Assuming getAllOrders is client-compatible
                setOrders(ordersData || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array ensures fetch runs only once on mount

    return (
        <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[50px] sm:pr-[20px] gap-5">
            <h1 className="text-[28px] font-bold text-[#161616]">Заказы</h1>
            {loading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-[#161616] ml-2">Загрузка...</p>
                </div>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-[#161616]">Заказов пока нет.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-[#DBDEEF]">
                            <th className="p-3 text-left text-[#161616] font-semibold">ID</th>
                            <th className="p-3 text-left text-[#161616] font-semibold">Email</th>
                            <th className="p-3 text-left text-[#161616] font-semibold">Сумма</th>
                            <th className="p-3 text-left text-[#161616] font-semibold">Статус</th>
                            <th className="p-3 text-left text-[#161616] font-semibold">Дата создания</th>
                            <th className="p-3 text-left text-[#161616] font-semibold">Ответ администратора</th>
                            <th className="p-3 text-left text-[#161616] font-semibold">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-[#DBDEEF]">
                                <td className="p-3 text-[#161616]">{order.id}</td>
                                <td className="p-3 text-[#161616]">{order.email || "N/A"}</td>
                                <td className="p-3 text-[#161616]">{order.totalAmount} ₽</td>
                                <td className="p-3 text-[#161616]">{order.status}</td>
                                <td className="p-3 text-[#161616]">
                                    {new Date(order.createdAt).toLocaleString("ru-RU", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    })}
                                </td>
                                <td className="p-3 text-[#161616]">{order.adminResponse || "Нет ответа"}</td>
                                <td className="p-3">
                                    <AdminResponseForm orderId={order.id} initialResponse={order.adminResponse} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}