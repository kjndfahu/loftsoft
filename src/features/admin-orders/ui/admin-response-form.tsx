"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateAdminResponse } from "@/enteties/orders/orders";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function AdminResponseForm({ orderId, initialResponse }: { orderId: number; initialResponse: string | null }) {
    const [state, formAction] = useFormState(updateAdminResponse, { success: false, error: null });
    const { pending } = useFormStatus();
    const [response, setResponse] = useState(initialResponse || "");

    return (
        <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="orderId" value={orderId} />
            <input
                type="text"
                name="adminResponse"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Введите ответ..."
                className="px-3 py-1 border-[1px] border-[#B9BCCB] rounded-[10px] text-[#161616] w-full"
            />
            <button
                type="submit"
                disabled={pending}
                className={`px-3 py-1 rounded-[10px] text-white font-semibold ${
                    pending ? "bg-gray-400" : "bg-[#161616]"
                } flex items-center justify-center`}
            >
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить"}
            </button>
            {state.success && <span className="text-green-600 text-sm">Сохранено</span>}
            {state.error && <span className="text-red-600 text-sm">{state.error}</span>}
        </form>
    );
}

export default AdminResponseForm;