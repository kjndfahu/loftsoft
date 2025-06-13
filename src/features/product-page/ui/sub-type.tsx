"use client"

import { useEffect } from "react"

interface SubTypeProps {
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

const licenseTypeLabels: Record<string, string> = {
    PERPETUAL: "Бессрочно",
    ONE_MONTH: "1 месяц",
    THREE_MONTHS: "3 месяца",
    SIX_MONTHS: "6 месяцев",
    ONE_YEAR: "1 год",
    TWO_YEARS: "2 года",
    THREE_YEARS: "3 года",
    FOUR_YEARS: "4 года",
    FIVE_YEARS: "5 лет",
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
        // Set default selections if current ones are invalid
        if (availableTypes.length > 0 && !availableTypes.includes(selectedType)) {
            setSelectedType(availableTypes[0])
        }
        if (deviceCounts.length > 0 && !deviceCounts.includes(selectedDeviceCount)) {
            setSelectedDeviceCount(deviceCounts[0])
        }
    }, [
        availableTypes,
        selectedType,
        setSelectedType,
        deviceCounts,
        selectedDeviceCount,
        setSelectedDeviceCount,
    ])

    // Dynamic message based on selected type
    const getPurchaseMessage = (type: string) => {
        switch (type) {
            case "KEY":
                return "После покупки будет выдан ключ."
            case "SUBSCRIPTION":
                return "После покупки будет активирована подписка."
            case "ACCOUNT":
                return "После покупки будут предоставлены данные аккаунта."
            default:
                return "После покупки будут предоставлены инструкции."
        }
    }

    // Only render if at least one selection option is available
    if (availableTypes.length === 0 && licenseTypes.length === 0 && deviceCounts.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[12px] md:p-6 p-4">
            {/* Subscription Type Selection */}
            {availableTypes.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h4 className="md:text-[16px] text-[14px] font-semibold text-[#161616]">Вид подписки</h4>
                    <div className="flex flex-wrap gap-[6px]">
                        {availableTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${
                                    selectedType === type ? "border-[#5069E8]" : "border-[#DBDEEF]"
                                }`}
                                aria-label={`Выбрать тип подписки ${subscriptionTypeLabels[type] || type}`}
                                aria-pressed={selectedType === type}
                            >
                                <span>{subscriptionTypeLabels[type] || type}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* License Type Selection */}
            {licenseTypes.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h4 className="md:text-[16px] text-[14px] font-semibold text-[#161616]">Срок лицензии</h4>
                    <div className="flex flex-wrap gap-[6px]">
                        {licenseTypes.map((licenseType) => (
                            <button
                                key={licenseType}
                                onClick={() => setSelectedLicenseType(licenseType)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${
                                    selectedLicenseType === licenseType ? "border-[#5069E8]" : "border-[#DBDEEF]"
                                }`}
                                aria-label={`Выбрать срок лицензии ${licenseTypeLabels[licenseType] || licenseType}`}
                                aria-pressed={selectedLicenseType === licenseType}
                            >
                                <span>{licenseTypeLabels[licenseType] || licenseType}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Device Count Selection */}
            {deviceCounts.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h4 className="md:text-[16px] text-[14px] font-semibold text-[#161616]">Количество устройств</h4>
                    <div className="flex flex-wrap gap-[6px]">
                        {deviceCounts.map((count) => (
                            <button
                                key={count}
                                onClick={() => setSelectedDeviceCount(count)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${
                                    selectedDeviceCount === count ? "border-[#5069E8]" : "border-[#DBDEEF]"
                                }`}
                                aria-label={`Выбрать количество устройств ${count} ПК`}
                                aria-pressed={selectedDeviceCount === count}
                            >
                                <span>{count} ПК</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Dynamic Purchase Message */}
            <p className="text-[12px] font-medium text-[#4E4F56]">{getPurchaseMessage(selectedType)}</p>
        </div>
    )
}