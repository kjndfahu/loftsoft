"use client"

import type React from "react"
import { X } from "lucide-react"

interface CharacteristicItemProps {
    index: number
    onRemove: (index: number) => void
    onChange: (index: number, title: string, value: string) => void
    title: string
    value: string
}

export const CharacteristicItem: React.FC<CharacteristicItemProps> = ({ index, onRemove, onChange, title, value }) => {
    return (
        <div className="flex items-center gap-3 w-full">
            <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                <input
                    className="bg-transparent w-full outline-0 text-[#161616] min-h-[44px] text-[16px]"
                    placeholder="Название характеристики"
                    type="text"
                    value={title}
                    onChange={(e) => onChange(index, e.target.value, value)}
                />
            </div>
            <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                <textarea
                    className="bg-transparent w-full outline-0 text-[#161616] min-h-[44px] text-[16px] resize-y"
                    placeholder="Значение"
                    value={value}
                    onChange={(e) => onChange(index, title, e.target.value)}
                />
            </div>
            <button type="button" onClick={() => onRemove(index)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}
