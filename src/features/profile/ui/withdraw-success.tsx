import { CheckIcon } from "lucide-react"

export const WithdrawSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-7 w-[360px] py-10 bg-white rounded-[16px]">
            <div className="bg-[#23A149] rounded-full w-10 h-10 flex items-center justify-center">
                <CheckIcon className="text-white h-5 w-5" />
            </div>
            <div className="flex flex-col gap-[11px] text-center">
                <h3 className="font-bold text-[18px] text-[#161616]">
                    Заявка на вывод
                    <br /> успешно создана!
                </h3>
                <p className="font-medium text-[12px] leading-[15px] text-[#8B8B8B]">Мы отправили вам уведомление на почту</p>
            </div>
        </div>
    )
}
