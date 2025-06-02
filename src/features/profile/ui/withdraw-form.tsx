"use client";

import type React from "react";

import { CrossLogo } from "@/shared/icons";
import { WithdrawInputs, type WithdrawFormData } from "@/features/profile/ui/withdraw-inputs";
import { type FC, useState } from "react";

import { WithdrawSuccess } from "@/features/profile/ui/withdraw-success";
import { createWithdrawRequest } from "@/enteties/user/create-withdraw-request";

interface Props {
    setIsClicked: (arg: boolean) => void;
    userEmail: string;
    availableSum: number;
}

export const WithdrawForm: FC<Props> = ({ setIsClicked, userEmail, availableSum }) => {
    const [formData, setFormData] = useState<WithdrawFormData>({
        phone: "",
        bank: "",
        name: "",
        sum: String(availableSum),
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!formData.phone || !/^\d{1,11}$/.test(formData.phone)) {
            setError("Пожалуйста, введите корректный номер телефона (1-11 цифр)");
            return;
        }

        if (!formData.bank) {
            setError("Пожалуйста, введите название банка");
            return;
        }

        if (!formData.name) {
            setError("Пожалуйста, введите имя владельца карты");
            return;
        }

        if (!userEmail) {
            setError("Email пользователя отсутствует");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await createWithdrawRequest({
                phone: formData.phone,
                bank: formData.bank,
                name: formData.name,
                sum: String(availableSum),
                userEmail,
            });

            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setIsClicked(false);
                }, 3000);
            } else {
                setError(result.error || "Произошла ошибка при создании заявки");
            }
        } catch (err: any) {
            setError(`Произошла ошибка при отправке формы: ${err.message || "Неизвестная ошибка"}`);
            console.error("Withdraw request error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (showSuccess) {
        return <WithdrawSuccess />;
    }

    return (
        <div onClick={e => e.stopPropagation()} className="flex items-center justify-center sm:w-[70vw] w-[96vw]">
            <form onSubmit={handleSubmit}
                  className="flex flex-col gap-4 w-[360px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
                <div className="flex items-center justify-between">
                    <h3 className="text-[22px] font-bold text-[#161616]">Вывод</h3>
                    <div onClick={() => setIsClicked(false)}>
                        <CrossLogo className="w-6 h-6 cursor-pointer"/>
                    </div>
                </div>

                <WithdrawInputs formData={formData} setFormData={setFormData} availableSum={availableSum}/>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end pt-2 gap-[6px]">
                    <button
                        type="button"
                        onClick={() => setIsClicked(false)}
                        className="text-[16px] w-[97px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="text-[16px] w-[122px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616] disabled:opacity-70"
                    >
                        {isLoading ? "Загрузка..." : "Сохранить"}
                    </button>
                </div>
            </form>
        </div>

    );
};