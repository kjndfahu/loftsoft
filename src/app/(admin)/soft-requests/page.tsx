import {RequestBlock} from "@/features/soft-requests/ui/request-block";

export default async function SoftRequestsPage() {
    return (
        <div className="flex flex-col py-[150px] pl-[350px] pr-[100px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] text-black font-semibold">Заявки по софту:</h1>
            </div>

            <div className="flex items-center flex-row gap-5 flex-wrap">
                <RequestBlock/>
                <RequestBlock/>
                <RequestBlock/>
            </div>
        </div>
    )
}
