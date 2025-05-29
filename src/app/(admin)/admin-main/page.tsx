'use client';

import { useEffect, useState } from 'react';
import {getAllOrders} from "@/enteties/orders/orders";
import {Order} from "@/kernel/types";


export default function AdminMainPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        statusBreakdown: { pending: 0, completed: 0, cancelled: 0 },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const orders: Order[] = await getAllOrders();
                const totalOrders = orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
                const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                const statusBreakdown = orders.reduce(
                    (acc, order) => {
                        if (order.status.toLowerCase() === 'pending') acc.pending += 1;
                        else if (order.status.toLowerCase() === 'completed') acc.completed += 1;
                        else if (order.status.toLowerCase() === 'cancelled') acc.cancelled += 1;
                        return acc;
                    },
                    { pending: 0, completed: 0, cancelled: 0 }
                );

                setStats({ totalOrders, totalRevenue, averageOrderValue, statusBreakdown });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order stats:', error);
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col w-full mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] gap-5">
            <h1 className="mds:text-3xl text-[22px] font-bold text-gray-800">Статистика заказов</h1>
            {loading ? (
                <p className="text-gray-600">Loading statistics...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700">Всего заказов</h2>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700">Сумма продаж</h2>
                        <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)}₽</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700">Средн. стоимость покупки</h2>
                        <p className="text-2xl font-bold text-purple-600">{stats.averageOrderValue.toFixed(2)}₽</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700">Статусы заказов</h2>
                        <p className="text-sm text-gray-600">В ожидании: {stats.statusBreakdown.pending}</p>
                        <p className="text-sm text-gray-600">Завершенные: {stats.statusBreakdown.completed}</p>
                        <p className="text-sm text-gray-600">Отмененные: {stats.statusBreakdown.cancelled}</p>
                    </div>
                </div>
            )}
        </div>
    );
}