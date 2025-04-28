"use client"

import { ThreeLines } from "@/shared/icons"
import { useState, useEffect } from "react"
import { OpenSearchBar } from "@/features/header/ui/open-search-bar"
import { AnimatePresence, motion } from "framer-motion"

import type { Category } from "@prisma/client"
import {getCategories} from "@/enteties/category/category";
import {getProductsByCategory} from "@/enteties/product/product";

export const CatalogBtn = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [allProducts, setAllProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

    // Fetch all data when the menu is opened
    useEffect(() => {
        if (isOpen) {
            const fetchAllData = async () => {
                setIsLoading(true)
                try {
                    console.log("Fetching categories and products...")

                    // Fetch categories
                    const categoriesData = await getCategories()
                    console.log("Categories fetched:", categoriesData)
                    setCategories(categoriesData || [])

                    // If we have categories, select the first one by default
                    if (categoriesData && categoriesData.length > 0 && selectedCategoryId === null) {
                        setSelectedCategoryId(categoriesData[0].id)
                    }

                    // Fetch all products (without category filter)
                    const productsResult = await getProductsByCategory(null)
                    console.log("Products fetched:", productsResult)

                    if (productsResult && productsResult.success) {
                        setAllProducts(productsResult.products || [])
                    } else {
                        console.error("Failed to fetch products:", productsResult?.error)
                        setAllProducts([])
                    }
                } catch (error) {
                    console.error("Error fetching data:", error)
                    setCategories([])
                    setAllProducts([])
                } finally {
                    setIsLoading(false)
                }
            }

            fetchAllData()
        }
    }, [isOpen])

    const handleCategorySelect = (categoryId: number) => {
        setSelectedCategoryId(categoryId)
    }

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 justify-center cursor-pointer text-[16px] text-white py-3 px-6 bg-[#5069E8] rounded-full relative z-50"
            >
                <ThreeLines />
                Каталог
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed top-[125px] inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <OpenSearchBar
                            categories={categories}
                            allProducts={allProducts}
                            isLoading={isLoading}
                            selectedCategoryId={selectedCategoryId}
                            onCategorySelect={handleCategorySelect}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
