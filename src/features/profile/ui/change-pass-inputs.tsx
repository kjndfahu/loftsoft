"use client"

import type React from "react"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface ChangePassInputsProps {
    error?: string
}

export const ChangePassInputs: React.FC<ChangePassInputsProps> = ({ error }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    return (
        <div className="flex flex-col pt-[24px] gap-4">
            <div className="flex flex-col gap-1">
                <label className={`text-[12px] ${error ? 'text-[#E71730]' : 'text-[#A4A8BA]'}`} htmlFor="currentPassword">
                    Текущий пароль
                </label>
                <div className={`flex items-center justify-between rounded-full border-[1px] ${error ? 'border-[#E71730]' : 'border-[#B9BCCB]'} px-[15px] py-[10px]`}>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Введите текущий пароль"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type={showCurrentPassword ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="ml-2 text-gray-500"
                    >
                        {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className={`text-[12px] ${error ? 'text-[#E71730]' : 'text-[#A4A8BA]'}`} htmlFor="newPassword">
                    Новый пароль
                </label>
                <div className={`flex items-center justify-between rounded-full border-[1px] ${error ? 'border-[#E71730]' : 'border-[#B9BCCB]'} px-[15px] py-[10px]`}>
                    <input
                        id="newPassword"
                        name="newPassword"
                        placeholder="Минимум 8 символов"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type={showNewPassword ? "text" : "password"}
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="ml-2 text-gray-500">
                        {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className={`text-[12px] ${error ? 'text-[#E71730]' : 'text-[#A4A8BA]'}`} htmlFor="confirmPassword">
                    Повторите пароль
                </label>
                <div className={`flex items-center justify-between rounded-full border-[1px] ${error ? 'border-[#E71730]' : 'border-[#B9BCCB]'} px-[15px] py-[10px]`}>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Минимум 8 символов"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type={showPassword ? "text" : "password"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-gray-500">
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            {error && <p className="text-[#E71730] text-sm">{error}</p>}
        </div>
    )
}
