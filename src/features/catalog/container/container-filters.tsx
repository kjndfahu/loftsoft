"use client"

import { useState } from "react"

import {CategoryTabs} from "@/features/catalog/ui/container-tabs";
import FilterPopup from "@/features/catalog/ui/filter-popup";

export function CategoryFilter() {
    const [activeCategory, setActiveCategory] = useState("all")

    const categories = [
        { id: "all", label: "Все"},
        { id: "design", label: "Проектирование" },
        { id: "development", label: "Разработка"},
        { id: "graphics", label: "Графика" },
        { id: "microsoft", label: "Майкрософт"},
        { id: "office", label: "Офисная"},
        { id: "security", label: "Безопасность"},
    ]

    const filterOptions = [
        { id: "rating", label: "По рейтингу" },
        { id: "popularity", label: "По популярности" },
        { id: "purchases", label: "По количеству покупок" },
        { id: "price_asc", label: "По возрастанию цены" },
        { id: "price_desc", label: "По убыванию цены" },
    ]

    const [selectedFilter, setSelectedFilter] = useState<string | undefined>("price_asc")

    const handleFilterSelect = (option: { id: string; label: string }) => {
        setSelectedFilter(option.id)
        console.log(`Selected filter: ${option.label}`)
    }

    return (
        <div className="flex justify-between items-center">
            <CategoryTabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory}/>
            <div className="w-[250px] bg-white rounded-xl">
                <FilterPopup
                    title="Фильтрация"
                    options={filterOptions}
                    onSelect={handleFilterSelect}
                    defaultSelected={selectedFilter}
                />
            </div>
        </div>
    )
}

