'use client'

import {useState} from "react";

export const ProductOptions = () => {
    const [activeCategory, setActiveCategory] = useState("1")
    const [term, setTerm] = useState("1")

    const categories = [
        { id: "1", label: "1 ПК"},
        { id: "2", label: "2 ПК" },
        { id: "3", label: "3 ПК"},
    ]

    const termData = [
        { id: "1", label: "1 Год"},
        { id: "2", label: "2 Года" },
        { id: "3", label: "3 Года"},
        { id: "4", label: "4 Года" },
        { id: "5", label: "5 Лет"},
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <span className="text-[14px] text-[#161616]">Количество устройств:</span>
                <div className="flex flex-wrap gap-[10px] w-[600px]">
                    {categories.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveCategory(tab.id)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${activeCategory === tab.id ? `border-[#5069E8]` : ` border-[#DBDEEF]`}`}>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <span className="text-[14px] text-[#161616]">Срок лицензии:</span>
                <div className="flex flex-wrap gap-[10px] w-[600px]">
                    {termData.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setTerm(tab.id)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${term === tab.id ? `border-[#5069E8]` : ` border-[#DBDEEF]`}`}>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}