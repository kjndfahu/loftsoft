"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Check } from "lucide-react"

export interface SubscriptionType {
    id: string
    title: string
}

const SUBSCRIPTION_TYPES: SubscriptionType[] = [
    { id: "key", title: "Ключ" },
    { id: "subscription", title: "Подписка" },
    { id: "account", title: "Аккаунт" },
]

interface SubscriptionTypePopupProps {
    onSelect: (subscriptionType: SubscriptionType) => void
    selectedType: SubscriptionType | null
}

export const SubscriptionTypePopup: React.FC<SubscriptionTypePopupProps> = ({ onSelect, selectedType }) => {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={popupRef}>
            <div
                className="flex w-full h-[46px] items-center justify-between px-4 border-[1px] border-[#B9BCCB] rounded-[20px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedType ? selectedType.title : "Вид подписки"}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#B9BCCB] rounded-[16px] shadow-lg">
                    {SUBSCRIPTION_TYPES.map((type) => (
                        <div
                            key={type.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                            onClick={() => {
                                onSelect(type)
                                setIsOpen(false)
                            }}
                        >
                            <span className="truncate">{type.title}</span>
                            {selectedType?.id === type.id && <Check className="w-4 h-4 text-[#161616]" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
