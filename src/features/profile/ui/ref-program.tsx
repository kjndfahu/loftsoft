"use client"

import { CopyLogo } from "@/shared/icons"
import { type FC, useState } from "react"
import { Modal } from "@/shared/modal"
import { WithdrawForm } from "@/features/profile/ui/withdraw-form"

interface Props {
    refCode?: string
    userEmail: string
    availableSum?: string
}

export const RefProgram: FC<Props> = ({ refCode, userEmail, availableSum = "1213₽" }) => {
    const [isClicked, setIsClicked] = useState(false)

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-[20px] text-[#161616] leading-[24px] font-semibold">Информация по программе</h3>
            <div className="flex border-l-[2px] border-l-[#5069E8] rounded-[16px] bg-[#F5F7FF] text-[#3853DB] text-[16px] leading-[20px] py-4 px-5">
                Реферальная система позволяет вам зарабатывать, отправляя свою уникальную ссылку другим пользователям. Каждый
                раз, когда кто-то совершает покупку по вашей ссылке, вы получаете 3% от суммы его покупки. Это простой и удобный
                способ получать бонусы за привлечение новых клиентов в магазин.
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline">
                    <div className="text-[14px] font-medium text-[#4E4F56]">Артикул</div>
                    <div className="flex-grow mx-2 relative">
                        <div className="absolute bottom-0 w-full border-b border-dashed border-gray-300"></div>
                    </div>
                    <div className="flex items-center cursor-pointer flex-shrink-0 gap-[6px] text-right text-[14px] font-medium text-[#5069E8]">
                        loftsoft.com/{refCode}
                        <CopyLogo />
                    </div>
                </div>
                <div className="flex items-baseline">
                    <div className="text-[14px] font-medium text-[#4E4F56]">Кол-во активаций</div>
                    <div className="flex-grow mx-2 relative">
                        <div className="absolute bottom-0 w-full border-b border-dashed border-gray-300"></div>
                    </div>
                    <div className="flex-shrink-0 text-right text-[14px] font-medium text-[#4E4F56]">14</div>
                </div>
                <div className="flex items-baseline">
                    <div className="text-[14px] font-medium text-[#4E4F56]">Процент с продаж</div>
                    <div className="flex-grow mx-2 relative">
                        <div className="absolute bottom-0 w-full border-b border-dashed border-gray-300"></div>
                    </div>
                    <div className="flex-shrink-0 text-right text-[14px] font-medium text-[#4E4F56]">3%</div>
                </div>
                <div className="flex items-baseline">
                    <div className="text-[14px] font-medium text-[#4E4F56]">Доступно к выводу</div>
                    <div className="flex-grow mx-2 relative">
                        <div className="absolute bottom-0 w-full border-b border-dashed border-gray-300"></div>
                    </div>
                    <div className="flex-shrink-0 text-right text-[14px] font-medium text-[#4E4F56]">{availableSum}</div>
                </div>
            </div>
            <button
                onClick={() => setIsClicked(true)}
                className="self-end text-[16px] text-white font-semibold w-[134px] h-[42px] rounded-full bg-[#5069E8]"
            >
                Вывести
            </button>
            {isClicked && (
                <Modal form={<WithdrawForm setIsClicked={setIsClicked} userEmail={userEmail} availableSum={availableSum} />} />
            )}
        </div>
    )
}
