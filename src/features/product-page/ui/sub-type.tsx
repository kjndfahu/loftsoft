// sub-type.tsx
"use client"

import { useState, useEffect } from "react"

type SubTypeProps = {
    availableTypes: string[]
    selectedType: string
    setSelectedType: (type: string) => void
    licenseTypes: string[]
    selectedLicenseType: string
    setSelectedLicenseType: (licenseType: string) => void
    deviceCounts: number[]
    selectedDeviceCount: number
    setSelectedDeviceCount: (count: number) => void
}

const subscriptionTypeLabels: Record<string, string> = {
    KEY: "Ключ",
    SUBSCRIPTION: "Подписка",
    ACCOUNT: "Аккаунт",
}

export const SubType = ({
                            availableTypes,
                            selectedType,
                            setSelectedType,
                            licenseTypes,
                            selectedLicenseType,
                            setSelectedLicenseType,
                            deviceCounts,
                            selectedDeviceCount,
                            setSelectedDeviceCount,
                        }: SubTypeProps) => {
    useEffect(() => {
        if (availableTypes.length > 0 && !availableTypes.includes(selectedType)) {
            setSelectedType(availableTypes[0])
        }
    }, [availableTypes, selectedType, setSelectedType])

    if (availableTypes.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[12px] mdbvp:p-6 p-4">
            <h4 className="mdbvp:text-[16px] text-[14px] font-semibold text-[#161616]">Вид подписки</h4>
            <div className="flex flex-wrap gap-[6px]">
                {availableTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${
                            selectedType === type ? `border-[#5069E8]` : `border-[#DBDEEF]`
                        }`}
                    >
                        <span>{subscriptionTypeLabels[type] || type}</span>
                    </button>
                ))}
            </div>
            <p className="text-[12px] font-medium text-[#4E4F56]">После покупки будет выдан ключ</p>
        </div>
    )
}