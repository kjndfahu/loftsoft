"use client"

import { useState, useEffect, useCallback } from "react"
import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { CategoryFilter } from "@/features/catalog/container/container-filters"

import { getCategories } from "@/enteties/category/category"
import {ItemsGrid} from "@/features/home/ui/items-grid";

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
    category?: any
    characteristics: any[]
    distributives: any[]
}

export default function CatalogPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories()
                setCategories(categoriesData)
            } catch (error) {
                console.error("Error fetching categories:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleProductsChange = useCallback((newProducts: Product[]) => {
        setProducts(newProducts)
    }, [])

    return (
        <div className="flex flex-col mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Каталог" />

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5069E8]"></div>
                </div>
            ) : (
                <>
                    <CategoryFilter categories={categories} onProductsChange={handleProductsChange} />
                    <div className="grid md:grid-cols-4 sml:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 w-full">
                        <ItemsGrid products={products} />
                    </div>
                </>
            )}
        </div>
    )
}
