"use client";

import { useState, useTransition } from "react";
import { OrderItem } from "@/features/orders/ui/order-item";
import { Order } from "@/kernel/types";
import { updateOrderText } from "@/enteties/orders/orders";

interface OrderOpenProps {
    order: Order;
    refetchOrders: () => Promise<void>;
}

export const OrderOpen = ({ order, refetchOrders }: OrderOpenProps) => {
    const [text, setText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        startTransition(async () => {
            setError(null);
            const response = await updateOrderText(order.id, text);
            if (response.success) {
                setText(""); // Clear the textarea after successful submission
                await refetchOrders(); // Trigger refetch of orders
            } else {
                setError(response.error || "Failed to submit text");
            }
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="border-[#DBDEEF] last:border-b-[1px]">
                {order.orderItems.map((item) => (
                    <OrderItem key={item.id} item={item} />
                ))}
            </div>
            {order.status === "PENDING" && !order.text && (
                <>
                    <div className="flex flex-col gap-2">
                        <h3 className="sm:text-[18px] text-[16px] text-[#4E4F56] font-semibold">
                            У вас есть подписка
                        </h3>
                        <div className="flex flex-col text-[#4E4F56] gap-7">
                            <p className="sm:text-[14px] text-[12px] font-medium">
                                Заполните данные в это поле, чтобы мы корректно выдали ваш заказ.
                                <br />
                                Сюда заполняются только подписки, остальное выдается нами
                            </p>
                            <p className="sm:text-[14px] text-[12px] font-medium">
                                "Если вы купили подписки на разные сроки, то пожалуйста
                                также их указывайте"
                                <br /> После всех действий пароль можно поменять обратно. Данные не
                                могут быть украдены.
                            </p>
                        </div>
                    </div>
                    <textarea
                        placeholder={
                            "Например:\nPhotoshop - Ваш логин и пароль\nJetbrains - Ваш логин и пароль"
                        }
                        className="py-[9px] px-[15px] sm:text-[14px] text-[12px] text-black placeholder:text-[#A4A8BA] bg-white border-[1px] border-[#CACDDC] rounded-[12px] h-[104px]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isPending}
                    ></textarea>
                    {error && <p className="text-red-500 text-[14px]">{error}</p>}
                    <button
                        className="sml:w-[121px] w-full text-white h-[42px] rounded-full bg-[#5069E8] disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={isPending || !text.trim()}
                    >
                        Отправить
                    </button>
                </>
            )}
            <div className="w-full h-[1px] bg-[#DBDEEF]" />
            <div className="flex sm:flex-row flex-col gap-3 sm:items-center justify-between">
                <p className="text-[14px] text-[#4E4F56]">
                    Способ оплаты:{" "}
                    <span className="text-[14px] font-medium text-[#161616]">
                        Cryptomus
                    </span>
                </p>
                <p className="text-[14px] text-[#4E4F56]">
                    Сумма заказа:{" "}
                    <span className="text-[14px] font-semibold text-[#161616]">
                        {order.totalAmount}₽
                    </span>
                </p>
            </div>
        </div>
    );
};