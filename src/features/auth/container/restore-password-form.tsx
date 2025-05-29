"use client"

import { ArrowRight, CrossLogo } from "@/shared/icons"
import { RestorePasswordInputs } from "@/features/auth/ui/restore-password-inputs"

export const RestorePasswordForm = ({
                                        setForgotPassword,
                                        handleLoginClick,
                                    }: {
    setForgotPassword: (arg: boolean) => void
    handleLoginClick: () => void
}) => {
    return (
        <form className="flex flex-col gap-4 sm:w-[360px] w-full pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Восстановить пароль</h3>
                <div onClick={() => setForgotPassword(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            <div onClick={handleLoginClick} className="flex font-semibold text-[16px] text-[#161616] gap-2 cursor-pointer">
                <ArrowRight className="rotate-180" />
                Назад
            </div>

            <RestorePasswordInputs />

            <div className="flex flex-col pt-2 gap-2">
                <button
                    type="button"
                    className="text-[16px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616]"
                >
                    Продолжить
                </button>
            </div>
        </form>
    )
}
