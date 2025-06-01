"use client"

import { CrossLogo } from "@/shared/icons"
import { LoginInputs } from "@/features/auth/ui/login-inputs"
import { useLoginForm } from "@/enteties/auth/use-auth-form"
import { GeneralError } from "@/shared/general-error"
import { Loader } from "@/shared/loader"
import { useEffect, useRef } from "react"
import { showToast } from "@/shared/custom-toast"

export const LoginForm = ({
                              setIsAuth,
                              handleRegistrationClick,
                              handleRestoreClick,
                              refreshUser
                          }: {
    setIsAuth: (arg: boolean) => void
    handleRegistrationClick: () => void
    handleRestoreClick: () => void
    refreshUser: () => Promise<void>
}) => {
    const { formData, errors, isLoading, generalError, handleChange, handleSubmit } = useLoginForm(() => {
        setIsAuth(false)
        showToast("Успешно отправлено!", "success", {
            secondaryMessage: "Вы вошли в аккаунт.",
        })
        refreshUser()
    })

    // Use refs to track toast display and prevent spamming
    const hasShownErrorRef = useRef(false)
    const lastGeneralErrorRef = useRef<string | null>(null)

    // Show error toast only when generalError changes (i.e., on a new submission error)
    useEffect(() => {
        if (!isLoading && generalError && generalError !== lastGeneralErrorRef.current) {
            showToast("Что-то пошло не так!", "error", {
                secondaryMessage: generalError,
            })
            lastGeneralErrorRef.current = generalError // Track the latest error to avoid duplicates
            hasShownErrorRef.current = true
        }
    }, [generalError, isLoading])

    // Reset hasShownErrorRef and lastGeneralErrorRef when a new submission starts
    useEffect(() => {
        if (isLoading) {
            hasShownErrorRef.current = false // Reset when a new submission starts
            lastGeneralErrorRef.current = null // Clear the last error on new submission
        }
    }, [isLoading])

    // Wrap handleChange to clear generalError when inputs change
    const handleChangeWithErrorClear = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (generalError) {
            // Note: We need useLoginForm to clear generalError here
            handleChange(e) // Call the original handleChange
        } else {
            handleChange(e)
        }
    }

    return (
        <div onClick={e => e.stopPropagation()} className="relative sm:w-[360px] w-full bg-white rounded-[16px]">
            <form
                onSubmit={(e) => {
                    e.preventDefault() // Prevent default form submission
                    handleSubmit(e)
                }}
                className="flex flex-col gap-4 w-full pt-4 pb-7 px-6"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-[22px] font-bold text-[#161616]">Войти</h3>
                    <div onClick={() => setIsAuth(false)}>
                        <CrossLogo className="w-6 h-6 cursor-pointer" />
                    </div>
                </div>

                <LoginInputs
                    generalError={generalError}
                    formData={formData}
                    errors={errors}
                    handleChange={handleChangeWithErrorClear}
                />

                <h3
                    onClick={handleRestoreClick}
                    className="text-[16px] font-semibold text-[#161616] self-end underline cursor-pointer"
                >
                    Забыли пароль?
                </h3>

                {generalError && !isLoading && (
                    <GeneralError generalError={generalError} />
                )}

                <div className="flex flex-col pt-2 gap-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="text-[16px] h-[42px] font-semibold text-white rounded-full bg-[#161616] disabled:opacity-70"
                    >
                        Войти
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

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[16px]">
                    <Loader />
                </div>
            )}
        </div>
    )
}