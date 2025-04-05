"use client"

import { useState, useRef, useEffect } from "react"
import {ChevronDown} from "@/shared/icons";

type FilterOption = {
    id: string
    label: string
}

interface FilterPopupProps {
    title: string
    options: FilterOption[]
    onSelect: (option: FilterOption) => void
    defaultSelected?: string
}

export default function FilterPopup({ title, options, onSelect, defaultSelected }: FilterPopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string | undefined>(defaultSelected)
    const popupRef = useRef<HTMLDivElement>(null)

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const handleOptionSelect = (option: FilterOption) => {
        setSelectedOption(option.id)
        onSelect(option)
        setIsOpen(false)
    }

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
            <div className="mb-2 text-[12px] text-[#A4A8BA]">{title}</div>
            <button
                className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none"
                onClick={togglePopup}
            >
        <span className="text-[14px] text-[#161616]">
          {selectedOption ? options.find((opt) => opt.id === selectedOption)?.label : "Выберите опцию"}
        </span>
                <ChevronDown className={`w-5 h-5 text-gray-700 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 z-10 mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                className={`w-full text-[14px] px-4 py-3 text-[#161616] text-left border-b border-gray-100 hover:border-black last:border-b-0 ${
                                    selectedOption === option.id ? "font-medium" : ""
                                }`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

