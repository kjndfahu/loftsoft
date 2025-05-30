"use client"

import { useState } from "react"
import { CrossLogo } from "@/shared/icons"
import { useRouter } from "next/navigation"
import type { FC } from "react"
import { deleteAccount } from "@/enteties/user/delete-me"
import { useAuth } from "@/enteties/auth/auth-provider"

interface Props {
    setIsDelete: (arg: boolean) => void
}

export const DeleteAccountForm: FC<Props> = ({ setIsDelete }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { refreshUser } = useAuth() // Add useAuth to access refreshUser

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        setError(null)

        const result = await deleteAccount()

        if (result.success) {
            await refreshUser() // Call refreshUser to update the auth state
            setIsDelete(false) // Close the modal
            router.push("/") // Redirect to home page
        } else {
            setError(result.error || "Произошла ошибка при удалении аккаунта")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 w-[360px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Удалить аккаунт?</h3>
                <div onClick={() => setIsDelete(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>

            <div className="w-full border-b-[1px] border-[#E6E6E6] pb-[20px] text-[14px] text-[#4E4F56]">
                Вы действительно хотите удалить аккаунт?
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end pt-2 gap-[6px]">
                <button
                    type="button"
                    onClick={() => setIsDelete(false)}
                    className="text-[16px] w-[97px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                    disabled={isLoading}
                >
                    Отмена
                </button>
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="text-[16px] w-[122px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616] disabled:opacity-70"
                >
                    {isLoading ? "Загрузка..." : "Удалить"}
                </button>
            </div>
        </div>
    )
}