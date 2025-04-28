import { WithdrawRequestBlock } from "@/features/withdraw-requests/ui/withdraw-request-block"
import {getWithdrawRequests} from "@/enteties/user/get-withdraw-request";


export default async function WithdrawRequestsPage() {
    const { success, data: withdrawRequests, error } = await getWithdrawRequests()

    return (
        <div className="flex flex-col w-full py-[150px] pl-[350px] pr-[100px] gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] text-black font-semibold">Заявки на вывод:</h1>
            </div>

            {!success && <div className="text-red-500">Ошибка при загрузке заявок: {error}</div>}

            {success && withdrawRequests?.length === 0 && (
                <div className="text-gray-500 text-center py-10">Заявок на вывод пока нет</div>
            )}

            <div className="flex items-center flex-row gap-5 flex-wrap">
                {success &&
                    withdrawRequests?.map((request: {
                                               id: number
                                               userEmail: string | null
                                               name: string
                                               bank: string
                                               phone: number
                                               sum: string
                                           },
                                           index: number,) => (
                        <WithdrawRequestBlock
                            key={request.id}
                            id={request.id}
                            email={request.userEmail}
                            name={request.name}
                            bank={request.bank}
                            phone={request.phone}
                            sum={request.sum}
                            index={index}
                        />
                    ))}
            </div>
        </div>
    )
}
