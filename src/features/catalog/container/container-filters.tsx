"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { CategoryTabs } from "@/features/catalog/ui/container-tabs"
import FilterPopup from "@/features/catalog/ui/filter-popup"
import {getSortedProducts} from "@/enteties/product/product";


interface Category {
    id: number
    photo: string
    title: string
    description: string
    createdAt: Date
    updateAt: Date
}

interface Product {
    id: number
    name: string
    price: string
    photo: string
    description?: string | null
    categoryId?: number | null
    type: string[]
    licenseType: string
    createdAt: Date
    updatedAt: Date
    category?: Category | null
    characteristics: any[]
    distributives: any[]
}

interface Props {
    categories: Category[]
    onProductsChange: (products: Product[]) => void
}

export function CategoryFilter({ categories, onProductsChange }: Props) {
    const [activeCategory, setActiveCategory] = useState("all")
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string>("price_asc")

    const isFirstRender = useRef(true)
    const prevCategoryId = useRef<number | null>(null)
    const prevFilter = useRef<string>("price_asc")

    const filterOptions = [
        { id: "rating", label: "По рейтингу" },
        { id: "popularity", label: "По популярности" },
        { id: "purchases", label: "По количеству покупок" },
        { id: "price_asc", label: "По возрастанию цены" },
        { id: "price_desc", label: "По убыванию цены" },
    ]

    // Мемоизируем функцию для получения товаров
    const fetchProducts = useCallback(
        async (categoryId: number | null, filter: string) => {
            if (categoryId === prevCategoryId.current && filter === prevFilter.current) {
                return
            }

            prevCategoryId.current = categoryId
            prevFilter.current = filter

            setIsLoading(true)
            try {
                const result = await getSortedProducts(categoryId, filter)
                if (result.success && result.products) {
                    onProductsChange(result.products)
                } else {
                    console.error("Failed to fetch products:", result.error)
                    onProductsChange([])
                }
            } catch (error) {
                console.error("Error fetching products:", error)
                onProductsChange([])
            } finally {
                setIsLoading(false)
            }
        },
        [onProductsChange],
    )

    const handleCategoryChange = useCallback(
        (categoryTitle: string) => {
            setActiveCategory(categoryTitle)

            let categoryId = null
            if (categoryTitle !== "all") {
                const category = categories.find((cat) => cat.title === categoryTitle)
                categoryId = category ? category.id : null
            }

            setActiveCategoryId(categoryId)
        },
        [categories],
    )

    const handleFilterSelect = useCallback((option: { id: string; label: string }) => {
        setSelectedFilter(option.id)
    }, [])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            fetchProducts(null, selectedFilter)
            return
        }

        const timer = setTimeout(() => {
            fetchProducts(activeCategoryId, selectedFilter)
        }, 300)

        return () => clearTimeout(timer)
    }, [activeCategoryId, selectedFilter, fetchProducts])

    return (
        <div className="flex mds:flex-row flex-col mds:gap-10 gap-3 justify-between mds:items-center">
            <CategoryTabs tabs={categories} activeTab={activeCategory} onChange={handleCategoryChange} />
            <div className="sm:w-[250px] w-full bg-white rounded-xl">
                <FilterPopup
                    title="Фильтрация"
                    options={filterOptions}
                    onSelect={handleFilterSelect}
                    defaultSelected={selectedFilter}
                />
            </div>
            {isLoading && (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5069E8]"></div>
                </div>
            )}
        </div>
    )
}
