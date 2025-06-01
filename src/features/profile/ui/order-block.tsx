'use client'

import { Button } from "@/shared/button";
import { ChevronDown } from "@/shared/icons";
import { useState } from "react";
import { OrderOpen } from "@/features/orders/container/order-open";
import { Modal } from "@/shared/modal";
import { CreateReview } from "@/shared/create-review";
import { Order } from "@/kernel/types";
import { formatOrderType } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OrderBlockProps {
    order: Order;
    refetchOrders: () => Promise<void>;
}

export const OrderBlock = ({ order, refetchOrders }: OrderBlockProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isReview, setIsReview] = useState(false);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="flex flex-col w-full mds:p-6 p-4 rounded-[16px] border-[1px] border-[#DBDEEF]">
            <div className="flex md:flex-row flex-col gap-4 pb-4 justify-between">
                <div className="flex flex-col gap-1 justify-between">
                    <span
                        className={`text-[13px] ${
                            order.status === "PENDING" ? "text-[#E71730]" : "text-[#23A149]"
                        }`}
                    >
                        • {order.status === "PENDING" ? "Заказ в обработке" : "Заказ выполнен"}
                    </span>
                    <span className="text-[20px] text-[#161616]">№{order.id}</span>
                </div>
                {isOpen && (
                    <div className="flex sml:flex-row flex-col gap-3">
                        <button
                            onClick={() => setIsReview(true)}
                            className="text-black text-[16px] font-semibold bg-white sml:w-[160px] w-full h-[42px] rounded-full border-[1px] border-[#DBDEEF]"
                        >
                            Оставить отзыв
                        </button>
                        {order.status === "PENDING" && !order.text && (
                            <button
                                className="text-white text-[16px] font-semibold bg-[#5069E8] sml:w-[184px] w-full h-[42px] rounded-full border-[1px] border-[#DBDEEF]"
                            >
                                Заполнить данные
                            </button>
                        )}
                    </div>
                )}
                {!isOpen && (
                    <Button onClick={() => setIsOpen(true)} logo={<ChevronDown />} text="Раскрыть список" />
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={{
                            open: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3, ease: "easeOut" }
                            },
                            closed: {
                                opacity: 0,
                                y: -20,
                                transition: { duration: 0.2, ease: "easeIn" }
                            }
                        }}
                    >
                        <OrderOpen order={order} refetchOrders={refetchOrders} />
                    </motion.div>
                )}
            </AnimatePresence>

            {isReview && (
                <Modal setModalOpen={setIsReview} form={<CreateReview setIsReview={setIsReview} orderId={order.id} />} />
            )}

            {!isOpen && (
                <div className="flex sml:flex-row flex-col gap-3 pt-4 border-t-[1px] border-[#DBDEEF] justify-between">
                    {order.orderItems.map((item) => (
                        <p className="text-[14px] text-[#4E4F56]" key={item.id}>
                            Тип товара: <span className="text-[#161616] font-medium">{formatOrderType(item.type)}</span>
                        </p>
                    ))}
                    <p className="text-[14px] text-[#4E4F56]">
                        <span>Дата оформления:</span>
                        <span className="text-[#161616] font-medium">{formatDate(order.createdAt)}</span>
                    </p>
                </div>
            )}
        </div>
    );
};