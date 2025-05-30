"use client";

import { useState, useEffect } from "react";
import { RequestBlock } from "@/features/soft-requests/ui/request-block";
import { AlertCircle } from "lucide-react";
import { getSoftRequests } from "@/enteties/soft-requests/soft-request";

export default function SoftRequestsPage() {
    const [softRequests, setSoftRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSoftRequests = async () => {
            try {
                setLoading(true);
                const { success, data: softRequests, error } = await getSoftRequests();
                if (success) {
                    setSoftRequests(softRequests || []);
                } else {
                    setError(error || "Не удалось загрузить заявки");
                }
            } catch (err) {
                setError("Не удалось загрузить заявки");
            } finally {
                setLoading(false);
            }
        };

        fetchSoftRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
                <div className="text-center py-10">Загрузка заявок...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
                <div className="flex items-center p-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Ошибка при загрузке заявок: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Заявки по софту:</h1>
            </div>
            {softRequests.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">Заявок пока нет</p>
                </div>
            )}
            <div className="grid md:grid-cols-3 sml:grid-cols-2 grid-cols-1 w-full">
                {softRequests.map((request) => (
                    <RequestBlock key={request.id} request={request} />
                ))}
            </div>
        </div>
    );
}