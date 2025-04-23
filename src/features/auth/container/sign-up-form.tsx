"use client"

import { CrossLogo } from "@/shared/icons"
import { SignUpInputs } from "@/features/auth/ui/sign-up-inputs"
import {useRegisterForm} from "@/enteties/auth/use-auth-form";


export const SignUpForm = ({
                               setIsRegistration,
                               handleLoginClick,
                           }: { setIsRegistration: (arg: boolean) => void; handleLoginClick: () => void }) => {
    const { formData, errors, isLoading, generalError, isAgreed, handleChange, handleSubmit } = useRegisterForm(() => {
        setIsRegistration(false)
    })

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[360px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Регистрация</h3>
                <div onClick={() => setIsRegistration(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            {generalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">{generalError}</div>
            )}

            <SignUpInputs formData={formData} errors={errors} handleChange={handleChange} />

            <div className="flex items-start gap-3">
                <input
                    className={`border-[2px] mt-[5px] ${errors.agreement ? "border-red-500" : "bg-[#CACDDC]"}`}
                    type="checkbox"
                    name="agreement"
                    checked={isAgreed}
                    onChange={handleChange}
                />
                <p className="text-[12px] leading-[15px] text-[#6A6B75] font-medium">
                    Ознакомлен и согласен с условиями
                    <br />
                    <span className="font-bold text-[#161616]">политики конфиденциальности.</span>
                </p>
            </div>
            {errors.agreement && <p className="text-red-500 text-[12px] mt-1">{errors.agreement}</p>}

            <div className="flex flex-col pt-2 gap-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="text-[16px] h-[42px] font-semibold text-white rounded-full bg-[#161616] disabled:opacity-70"
                >
                    {isLoading ? "Загрузка..." : "Зарегистрироваться"}
                </button>
                <button
                    type="button"
                    onClick={handleLoginClick}
                    className="text-[16px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                >
                    Войти
                </button>
            </div>
        </form>
    )
}
