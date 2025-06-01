"use client";

import { Modal } from "@/shared/modal";
import { AdminResponseModal } from "@/features/admin-orders/ui/admin-response-modal";
import { useState } from "react";

export default function AdminResponseForm({
                                              orderId,
                                              initialResponse,
                                              email,
                                              totalAmount,
                                              refetchOrders,
                                          }: {
    orderId: number;
    initialResponse: string | null;
    email: string | null;
    totalAmount: number;
    refetchOrders: () => Promise<void>;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log("AdminResponseForm props:", { orderId, initialResponse, email, totalAmount });

    return (
        <div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 bg-[#161616] text-white rounded-[10px] font-semibold"
            >
                Ответить
            </button>
            {isModalOpen && (
                <Modal
                    setModalOpen={setIsModalOpen}
                    form={
                        <AdminResponseModal
                            orderId={orderId}
                            initialResponse={initialResponse}
                            setIsOpen={setIsModalOpen}
                            email={email || "default@example.com"}
                            totalAmount={totalAmount}
                            refetchOrders={refetchOrders} // Pass the refetch callback
                        />
                    }
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}