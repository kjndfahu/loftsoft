"use client"

import { useState, useEffect } from "react"


type SubTypeProps = {
    availableTypes: any["type"]
    licenseType?: any
}

export const SubType = ({ availableTypes, licenseType }: SubTypeProps) => {
    // If no types are available, default to KEY
    const hasKey = availableTypes.includes("KEY")
    const hasAccount = availableTypes.includes("ACCOUNT")

    // Set default active category based on available types
    const defaultCategory = hasKey ? "key" : hasAccount ? "account" : "key"
    const [activeCategory, setActiveCategory] = useState(defaultCategory)

    // Update active category if available types change
    useEffect(() => {
        if (availableTypes.length > 0) {
            if (!hasKey && activeCategory === "key") {
                setActiveCategory("account")
            } else if (!hasAccount && activeCategory === "account") {
                setActiveCategory("key")
            }
        }
    }, [availableTypes, hasKey, hasAccount, activeCategory])

    // Get license type description
    const getLicenseDescription = () => {
        switch (licenseType) {
            case "PERPETUAL":
                return "Бессрочная лицензия"
            case "ONE_MONTH":
                return "Лицензия на 1 месяц"
            case "THREE_MONTHS":
                return "Лицензия на 3 месяца"
            case "SIX_MONTHS":
                return "Лицензия на 6 месяцев"
            case "ONE_YEAR":
                return "Лицензия на 1 год"
            default:
                return "После покупки будет выдан ключ"
        }
    }

    if (!hasKey && !hasAccount) {
        return null
    }

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[12px] p-6">
            <h4 className="text-[16px] font-semibold text-[#161616]">Вид подписки</h4>
            <div className="flex gap-[6px]">
                {hasKey && (
                    <button
                        onClick={() => setActiveCategory("key")}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${activeCategory === "key" ? `border-[#5069E8]` : ` border-[#DBDEEF]`}`}
                    >
                        <span>Ключ</span>
                    </button>
                )}

                {hasAccount && (
                    <button
                        onClick={() => setActiveCategory("account")}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${activeCategory === "account" ? `border-[#5069E8]` : ` border-[#DBDEEF]`}`}
                    >
                        <span>Аккаунт</span>
                    </button>
                )}
            </div>
            <p className="text-[12px] text-[#4E4F56]">{getLicenseDescription()}</p>
        </div>
    )
}
