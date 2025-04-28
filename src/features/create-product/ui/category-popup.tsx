"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Check } from "lucide-react"
import {getCategories} from "@/enteties/category/category";


interface Category {
    id: string
    title: string
    description: string
    photo: string
    createdAt: Date
}

interface CategoryPopupProps {
    onSelect: (category: any) => void
    selectedCategory: any | null
}

export const CategoryPopup: React.FC<CategoryPopupProps> = ({ onSelect, selectedCategory }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories()
                setCategories(data)
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

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
                className="flex w-[230px] h-[46px] items-center justify-between px-4 border-[1px] border-[#B9BCCB] rounded-[20px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedCategory ? selectedCategory.title : "Категория"}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#B9BCCB] rounded-[16px] shadow-lg max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Загрузка...</div>
                    ) : categories.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Нет доступных категорий</div>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                onClick={() => {
                                    onSelect(category)
                                    setIsOpen(false)
                                }}
                            >
                                <span className="truncate">{category.title}</span>
                                {selectedCategory?.id === category.id && <Check className="w-4 h-4 text-[#161616]" />}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
