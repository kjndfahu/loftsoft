"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CrossLogo } from "@/shared/icons"
import { ChangePassInputs } from "@/features/profile/ui/change-pass-inputs"
import { ChangePassSuccess } from "@/features/profile/ui/change-pass-success"
import type { FC } from "react"
import { changePassword, type ChangePasswordFormData } from "@/enteties/user/change-password"

interface Props {
    setIsClicked: (arg: boolean) => void
}

export const ChangePasswordForm: FC<Props> = ({ setIsClicked }) => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                setIsClicked(false)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [showSuccessModal, setIsClicked])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data: ChangePasswordFormData = {
            currentPassword: formData.get("currentPassword") as string,
            newPassword: formData.get("newPassword") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        }

        const result = await changePassword(data)
        setIsLoading(false)

        if (result.success) {
            setShowSuccessModal(true)
        } else {
            setError(result.error || "Произошла ошибка при смене пароля")
        }
    }

    if (showSuccessModal) {
        return <ChangePassSuccess />
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[360px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Смена пароля</h3>
                <div onClick={() => setIsClicked(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            <ChangePassInputs error={error || undefined} />

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
    )
}
