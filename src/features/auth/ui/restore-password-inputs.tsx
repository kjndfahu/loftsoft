"use client"

import type React from "react"

interface RestorePasswordInputsProps {
    formData: { email: string }
    errors: { [key: string]: string }
    generalError?: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const RestorePasswordInputs = ({ formData, errors, generalError, handleChange }: RestorePasswordInputsProps) => {
    return (
        <div className="flex flex-col pt-[24px] gap-4">
            <div className="flex flex-col gap-1">
                <label
                    className={`text-[12px] ${generalError || errors.email ? "text-[#E71730]" : "text-[#A4A8BA]"}`}
                    htmlFor="email"
                >
                    Email
                </label>
                <div
                    className={`flex items-center justify-between rounded-full border-[1px] ${
                        generalError || errors.email ? "border-[#E71730]" : "border-[#B9BCCB]"
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
                {errors.email && (
                    <p className="text-[12px] text-[#E71730] mt-1">{errors.email}</p>
                )}
            </div>
        </div>
    )
}