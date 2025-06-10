"use client"

import type React from "react"

import { useState } from "react"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import {LoginFormData} from "@/enteties/auth/auth-actions";

interface LoginInputsProps {
    formData: LoginFormData
    errors: { [key: string]: string }
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    generalError?: string
}

export const LoginInputs = ({ formData, errors, handleChange, generalError }: LoginInputsProps) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex flex-col pt-[24px] gap-4">
            <div className="flex flex-col gap-1">
                <label className={`text-[12px] ${generalError ? 'text-[#E71730]' : 'text-[#A4A8BA]'}`} htmlFor="email">
                    Email
                </label>
                <div
                    className={`rounded-full border-[1px] ${generalError ? "border-[#E71730]" : "border-[#B9BCCB]"} px-[15px] py-[10px]`}
                >
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ваша почта"
                        className="text-[14px] text-[#161616] outline-0 w-full focus:outline-none"
                        type="email"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className={`text-[12px] ${generalError ? 'text-[#E71730]' : 'text-[#A4A8BA]'} `}
                       htmlFor="password">
                Пароль
                </label>
                <div
                    className={`flex items-center justify-between rounded-full border-[1px] ${generalError ? "border-[#E71730]" : "border-[#B9BCCB]"} px-[15px] py-[10px]`}
                >
                    <input
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Минимум 8 символов"
                        className="text-[14px] text-[#161616] outline-0 w-full focus:outline-none"
                        type={showPassword ? "text" : "password"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-gray-500">
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </div>
    )
}