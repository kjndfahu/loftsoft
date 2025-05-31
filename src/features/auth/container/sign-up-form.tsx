"use client"

import { CrossLogo } from "@/shared/icons"
import { SignUpInputs } from "@/features/auth/ui/sign-up-inputs"
import { useRegisterForm } from "@/enteties/auth/use-auth-form"
import { GeneralError } from "@/shared/general-error"
import { Loader } from "@/shared/loader"

import { useEffect, useRef } from "react"
import {showToast} from "@/shared/custom-toast";
import Link from "next/link";

export const SignUpForm = ({
                               setIsRegistration,
                               handleLoginClick,
                               refreshUser,
                           }: {
    setIsRegistration: (arg: boolean) => void;
    handleLoginClick: () => void;
    refreshUser: () => Promise<void>; // Add type for refreshUser
}) => {
    const { formData, errors, isLoading, generalError, isAgreed, handleChange, handleSubmit } = useRegisterForm(() => {
        setIsRegistration(false)
        showToast("Успешно отправлено!", "success", {
            secondaryMessage: "Ваш аккаунт создан. Ожидайте подтверждения.",
        })
        refreshUser() // Call refreshUser after successful registration
    })

    // Use a ref to track if the error toast has been shown for the current submission
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

    // Reset hasShownErrorRef when a new submission starts
    useEffect(() => {
        if (isLoading) {
            hasShownErrorRef.current = false // Reset when a new submission starts
            lastGeneralErrorRef.current = null // Clear the last error on new submission
        }
    }, [isLoading])

    // Wrap handleChange to clear generalError when email changes
    const handleChangeWithErrorClear = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e) // Просто передаём событие в handleChange из useRegisterForm
    }

    return (
        <div className="relative sm:w-[360px] w-full bg-white rounded-[16px]">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(e)
                }}
                className="flex flex-col gap-4 w-full pt-4 pb-7 px-6"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-[22px] font-bold text-[#161616]">Регистрация</h3>
                    <div onClick={() => setIsRegistration(false)}>
                        <CrossLogo className="w-6 h-6 cursor-pointer" />
                    </div>
                </div>

                <SignUpInputs formData={formData} errors={errors} handleChange={handleChangeWithErrorClear} />

                <div className="flex items-start gap-3">
                    <input
                        className={`border-[2px] mt-[5px] ${errors.agreement ? "border-red-500" : "bg-[#CACDDC]"}`}
                        type="checkbox"
                        name="agreement"
                        checked={isAgreed}
                        onChange={handleChangeWithErrorClear}
                    />
                    <p className={`text-[12px] leading-[15px] font-medium ${errors.agreement ? "text-red-500" : "text-[#6A6B75]"}`}>
                        Ознакомлен и согласен с условиями
                        <br />
                        <Link href="/privacy-policy">
                            <span className={`font-bold ${errors.agreement ? "text-red-500" : "text-[#161616]"}`}>
                            политики конфиденциальности.
                        </span>
                        </Link>
                    </p>
                </div>

                {generalError && !isLoading && (
                    <GeneralError generalError={generalError}/>
                )}

                <div className="flex flex-col pt-2 gap-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="text-[16px] h-[42px] font-semibold text-white rounded-full bg-[#161616] disabled:opacity-70 flex items-center justify-center"
                    >
                        Зарегистрироваться
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

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[16px]">
                    <Loader />
                </div>
            )}
        </div>
    )
}