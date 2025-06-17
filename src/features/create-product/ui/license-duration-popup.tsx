// /src/components/license-duration-popup.tsx
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface LicenseDuration {
    id: string;
    title: string;
}

const LICENSE_DURATIONS: LicenseDuration[] = [
    { id: "perpetual", title: "Бессрочно" },
    { id: "1month", title: "1 месяц" },
    { id: "3months", title: "3 месяца" },
    { id: "6months", title: "6 месяцев" },
    { id: "1year", title: "1 год" },
    { id: "2years", title: "2 года" },
    { id: "3years", title: "3 года" },
    { id: "4years", title: "4 года" },
    { id: "5years", title: "5 лет" },
];

interface LicenseDurationPopupProps {
    onSelect: (duration: LicenseDuration) => void;
    selectedDurations: LicenseDuration[];
}

export const LicenseDurationPopup: React.FC<LicenseDurationPopupProps> = ({ onSelect, selectedDurations }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={popupRef}>
            <div
                className="flex w-full text-black h-[46px] items-center justify-between px-4 border-[1px] border-[#B9BCCB] rounded-[20px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">
                    {selectedDurations.length > 0
                        ? selectedDurations.map((duration) => duration.title).join(", ")
                        : "Срок лицензии"}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#B9BCCB] rounded-[16px] shadow-lg">
                    {LICENSE_DURATIONS.map((duration) => (
                        <div
                            key={duration.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                            onClick={() => {
                                onSelect(duration);
                            }}
                        >
                            <span className="truncate">{duration.title}</span>
                            {selectedDurations.some((selected) => selected.id === duration.id) && (
                                <Check className="w-4 h-4 text-[#161616]" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};