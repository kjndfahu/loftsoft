"use client"

import type React from "react"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { RegisterFormData } from "@/enteties/auth/auth-actions"

interface SignUpInputsProps {
    formData: RegisterFormData
    errors: { [key: string]: string }
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SignUpInputs = ({ formData, errors, handleChange }: SignUpInputsProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="flex flex-col pt-[24px] gap-4">
            <div className="flex flex-col gap-1">
                <label
                    className={`text-[12px] ${errors.email || errors.general?.includes("Пользователь с таким email уже существует") ? "text-red-500" : "text-[#A4A8BA]"}`}
                    htmlFor="email"
                >
                    Email
                </label>
                <div
                    className={`rounded-full border-[1px] ${
                        errors.email || errors.general?.includes("Пользователь с таким email уже существует")
                            ? "border-red-500"
                            : "border-[#B9BCCB]"
                    } px-[15px] py-[10px]`}
                >
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ваша почта"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type="email"
                    />
                </div>
                {(errors.email || errors.general?.includes("Пользователь с таким email уже существует")) && (
                    <p className="text-red-500 text-[12px] mt-1">
                        {errors.email || errors.general}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className={`text-[12px] ${errors.password ? "text-red-500" : "text-[#A4A8BA]"}`}
                    htmlFor="password"
                >
                    Пароль
                </label>
                <div
                    className={`flex items-center justify-between rounded-full border-[1px] ${
                        errors.password || errors.confirmPassword ? "border-red-500" : "border-[#B9BCCB]"
                    } px-[15px] py-[10px]`}
                >
                    <input
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Минимум 8 символов"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type={showPassword ? "text" : "password"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-gray-500">
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-[12px] mt-1">{errors.password}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className={`text-[12px] ${errors.confirmPassword ? "text-red-500" : "text-[#A4A8BA]"}`}
                    htmlFor="confirmPassword"
                >
                    Повторите пароль
                </label>
                <div
                    className={`flex items-center justify-between rounded-full border-[1px] ${
                        errors.password || errors.confirmPassword ? "border-red-500" : "border-[#B9BCCB]"
                    } px-[15px] py-[10px]`}
                >
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Минимум 8 символов"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type={showConfirmPassword ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="ml-2 text-gray-500"
                    >
                        {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.confirmPassword}</p>
                )}
            </div>
        </div>
    )
}