"use client"

import type React from "react"

export type WithdrawFormData = {
    phone: number
    bank: string
    name: string
    sum: string
}

interface WithdrawInputsProps {
    formData: WithdrawFormData
    setFormData: (data: WithdrawFormData) => void
    availableSum: string
}

export const WithdrawInputs = ({ formData, setFormData, availableSum }: WithdrawInputsProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    return (
        <div className="flex flex-col pt-[24px] gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#A4A8BA]" htmlFor="phone">
                    Номер телефона
                </label>
                <div className="flex items-center justify-between rounded-full border-[1px] border-[#B9BCCB] px-[15px] py-[10px]">
                    <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Введите номер телефона"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type="number"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#A4A8BA]" htmlFor="bank">
                    Название банка
                </label>
                <div className="flex items-center justify-between rounded-full border-[1px] border-[#B9BCCB] px-[15px] py-[10px]">
                    <input
                        id="bank"
                        name="bank"
                        value={formData.bank}
                        onChange={handleChange}
                        placeholder="Например Т-Банк"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type="text"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#A4A8BA]" htmlFor="name">
                    Кому принадлежит карта
                </label>
                <div className="flex items-center justify-between rounded-full border-[1px] border-[#B9BCCB] px-[15px] py-[10px]">
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Например Марк Майдеров"
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type="text"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#A4A8BA]" htmlFor="sum">
                    К выводу
                </label>
                <div className="px-[15px] py-[10px] text-[#161616] text-[14px] rounded-full w-full bg-[#E9EBF6]">
                    {availableSum}
                </div>
            </div>
        </div>
    )
}
