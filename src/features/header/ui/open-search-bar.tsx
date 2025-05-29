"use client"

import { motion } from "framer-motion"
import { CatalogBar } from "@/features/header/ui/catalog-bar"
import { useMemo } from "react"
import Link from "next/link"

interface Product {
    id: number
    name: string
    price: string
    photo: string
    description: string
    categoryId: number
    type: string[]
    licenseType: string
    createdAt: Date
    updatedAt: Date
    category?: {
        title: string
    }
}

interface OpenSearchBarProps {
    categories: {
        id: number
        photo: string
        title: string
        description: string
        createdAt: Date
        updateAt: Date
    }[]
    allProducts: Product[]
    isLoading: boolean
    selectedCategoryId: number | null
    onCategorySelect: (categoryId: number) => void
}

export const OpenSearchBar = ({
                                  categories,
                                  allProducts,
                                  isLoading,
                                  selectedCategoryId,
                                  onCategorySelect,
                              }: OpenSearchBarProps) => {
    const categoryTitle = useMemo(() => {
        if (!selectedCategoryId) return ""
        const category = categories.find((c) => c.id === selectedCategoryId)
        return category ? category.title : ""
    }, [selectedCategoryId, categories])

    const filteredProducts = useMemo(() => {
        if (!selectedCategoryId) return []
        return allProducts.filter((product) => product.categoryId === selectedCategoryId)
    }, [selectedCategoryId, allProducts])

    const productColumns = useMemo(() => {
        if (filteredProducts.length === 0) return [[], [], []]

        const columnHeight = Math.ceil(filteredProducts.length / 3)
        const columns: Product[][] = [[], [], []]

        filteredProducts.forEach((product, index) => {
            const columnIndex = Math.floor(index / columnHeight)
            if (columnIndex < 3) {
                columns[columnIndex].push(product)
            }
        })

        return columns
    }, [filteredProducts])

    const slideVariants = {
        hidden: {
            opacity: 0,
            y: -20,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            y: 0,
            height: "auto",
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    }

    return (
        <motion.div
            className="absolute top-full xl:w-[1450px] lg:w-[1200px] mdbvp:w-[1100px] md:w-[1000px] w-[700px] h-[357px] xl:left-[-300px] lg:left-[-150px] mdbvp:left-[-100px] md:left-[-200px] left-[-170px] bg-white rounded-b-lg shadow-lg z-50 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
        >
            <div className="flex p-8">
                <CatalogBar
                    categories={categories}
                    onCategorySelect={onCategorySelect}
                    selectedCategoryId={selectedCategoryId}
                />

                <div className="flex flex-col gap-6 py-2 px-8 flex-1">
                    {isLoading ? (
                        <div className="text-center py-8">Загрузка данных...</div>
                    ) : !selectedCategoryId ? (
                        <div className="text-center text-[#6A6B75] py-12">Выберите категорию для просмотра товаров</div>
                    ) : (
                        <>
                            <h2 className="text-[#161616] text-[27px] font-medium">{categoryTitle}</h2>

                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-8">В данной категории нет товаров</div>
                            ) : (
                                <div className="flex gap-[144px]">
                                    {productColumns.map((column, columnIndex) => (
                                        <div key={columnIndex} className="flex flex-col gap-4">
                                            {column.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/catalog/${product.id}`}
                                                    className="text-[16px] text-[#4E4F56] cursor-pointer font-medium hover:text-[#5069E8] transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    )
}