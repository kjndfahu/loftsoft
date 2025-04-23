"use client"

import { CrossLogo } from "@/shared/icons"
import { LoginInputs } from "@/features/auth/ui/login-inputs"
import { useLoginForm } from "@/enteties/auth/use-auth-form"

export const LoginForm = ({
                              setIsAuth,
                              handleRegistrationClick,
                              handleRestoreClick,
                          }: {
    setIsAuth: (arg: boolean) => void
    handleRegistrationClick: () => void
    handleRestoreClick: () => void
}) => {
    const { formData, errors, isLoading, generalError, handleChange, handleSubmit } = useLoginForm(() => {
        setIsAuth(false)
    })

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[360px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Войти</h3>
                <div onClick={() => setIsAuth(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            {generalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">{generalError}</div>
            )}

            <LoginInputs formData={formData} errors={errors} handleChange={handleChange} />

            <h3
                onClick={handleRestoreClick}
                className="text-[16px] font-semibold text-[#161616] self-end underline cursor-pointer"
            >
                Забыли пароль?
            </h3>

            <div className="flex flex-col pt-2 gap-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="text-[16px] h-[42px] font-semibold text-white rounded-full bg-[#161616] disabled:opacity-70"
                >
                    {isLoading ? "Загрузка..." : "Войти"}
                </button>
                <button
                    type="button"
                    onClick={handleRegistrationClick}
                    className="text-[16px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                >
                    Зарегистрироваться
                </button>
            </div>
        </form>
    )
}
