
import { RequestBlock } from "@/features/soft-requests/ui/request-block"
import { AlertCircle } from "lucide-react"
import {getSoftRequests} from "@/enteties/soft-requests/soft-request";

export default async function SoftRequestsPage() {
    const { success, data: softRequests, error } = await getSoftRequests()

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Заявки по софту:</h1>
            </div>

            {!success && (
                <div className="flex items-center p-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Ошибка при загрузке заявок: {error}</span>
                </div>
            )}

            {success && softRequests.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">Заявок пока нет</p>
                </div>
            )}

            <div className="grid md:grid-cols-3 sml:grid-cols-2 grid-cols-1 w-full">
                {success && softRequests.map((request) => <RequestBlock key={request.id} request={request} />)}
            </div>
        </div>
    )
}
