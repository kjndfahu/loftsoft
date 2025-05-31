"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateAdminResponse } from "@/enteties/orders/orders";
import { Loader2 } from "lucide-react";
import { CrossLogo } from "@/shared/icons";
import { sendAdminResponseEmail } from "@/enteties/soft-requests/send-admin-response";

interface AdminResponseModalProps {
    orderId: number;
    initialResponse: string | null;
    setIsOpen: (open: boolean) => void;
    email: string;
    totalAmount: number;
    refetchOrders: () => Promise<void>;
}

export const AdminResponseModal: React.FC<AdminResponseModalProps> = ({
                                                                          orderId,
                                                                          initialResponse,
                                                                          setIsOpen,
                                                                          email,
                                                                          totalAmount,
                                                                          refetchOrders,
                                                                      }) => {
    const [state, formAction] = useFormState(handleFormSubmission, { success: false, errors: null });
    const { pending } = useFormStatus();
    const [response, setResponse] = useState(initialResponse || "");

    async function handleFormSubmission(state: any, formData: FormData) {
        console.log("FormData received:", Object.fromEntries(formData));
        const emailAction = await sendAdminResponseEmail(state, formData);
        console.log("Email action result:", emailAction);
        if (emailAction.success) {
            let updateAction;
            try {
                updateAction = await updateAdminResponse(state, formData);
                console.log("Update action result:", updateAction);
                if (!updateAction.success) {
                    console.error("Update failed with errors:", updateAction.errors);
                    return { success: false, errors: updateAction.errors || { _errors: "Failed to update admin response" } };
                }
            } catch (updateError) {
                console.error("UpdateAdminResponse threw an error:", updateError);
                return { success: false, errors: { _errors: updateError instanceof Error ? updateError.message : "Unexpected update error" } };
            }
            // If both actions succeed, refetch orders
            await refetchOrders();
            setIsOpen(false); // Close the modal after success
            return { success: true, errors: null };
        }
        console.error("Email sending failed with errors:", emailAction.errors);
        return emailAction;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-7 w-[500px] py-10 px-6 bg-white rounded-[16px]">
            <div className="flex items-center w-full justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Ответ на заказ #{orderId}</h3>
                <div onClick={() => setIsOpen(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>
            <form action={formAction} className="w-full">
                <input type="hidden" name="orderId" value={orderId} />
                <input type="hidden" name="requestId" value={orderId.toString()} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="totalAmount" value={totalAmount.toString()} />
                <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
                    <textarea
                        name="response"
                        className="bg-transparent w-full h-[200px] outline-0 text-[#161616]"
                        placeholder="Напишите ответ"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={pending}
                    className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded-[10px] hover:bg-blue-600 flex items-center justify-center ${
                        pending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Отправить"}
                </button>
                {state.success && <span className="text-green-600 text-sm mt-2">Ответ сохранен и отправлен</span>}
                {state.errors?._errors && <span className="text-red-600 text-sm mt-2">{state.errors._errors}</span>}
            </form>
        </div>
    );
};