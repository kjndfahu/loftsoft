"use client"

import { CrossLogo, ThreeLines } from "@/shared/icons"
import { useState } from "react"
import { OpenSearchBar } from "@/features/header/ui/open-search-bar"
import { AnimatePresence, motion } from "framer-motion"
import { useCatalog } from "@/features/header/catalog-context"

export const CatalogBtn = ({ isOpen, onOpen, onClose }: { isOpen: boolean, onOpen: () => void, onClose: () => void }) => {
    const { categories, allProducts, isLoading, selectedCategoryId, setSelectedCategoryId } = useCatalog()

    const handleCategorySelect = (categoryId: number) => {
        setSelectedCategoryId(categoryId)
    }

    return (
        <div className="relative">
            <div
                onClick={() => {
                    if (isOpen) {
                        onClose()
                    } else {
                        onOpen()
                    }
                }}
                className={`flex relative items-center gap-2 justify-center cursor-pointer text-[16px] py-3 px-6 ${isOpen ? 'bg-[#F5F7FF] text-[#5069E8]' : 'bg-[#5069E8] text-white'} rounded-full relative z-50`}
            >
                {isOpen ? (
                    <svg
                        width={12}
                        height={11}
                        viewBox="0 0 12 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.962 0.258907C10.8063 0.102863 10.5949 0.0151693 10.3745 0.0151693C10.1541 0.0151693 9.9427 0.102863 9.78701 0.258907L5.71201 4.32557L1.63701 0.250574C1.48132 0.09453 1.26994 0.00683594 1.04951 0.00683594C0.82908 0.00683594 0.617705 0.09453 0.462012 0.250574C0.137012 0.575574 0.137012 1.10057 0.462012 1.42557L4.53701 5.50057L0.462012 9.57557C0.137012 9.90057 0.137012 10.4256 0.462012 10.7506C0.787012 11.0756 1.31201 11.0756 1.63701 10.7506L5.71201 6.67557L9.78701 10.7506C10.112 11.0756 10.637 11.0756 10.962 10.7506C11.287 10.4256 11.287 9.90057 10.962 9.57557L6.88701 5.50057L10.962 1.42557C11.2787 1.10891 11.2787 0.575574 10.962 0.258907Z"
                            fill="#5069E8"
                        />
                    </svg>
                ) : (
                    <ThreeLines />
                )}
                Каталог
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed top-[130px] inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onClose}
                        />

                        <OpenSearchBar
                            categories={categories}
                            allProducts={allProducts}
                            isLoading={isLoading}
                            selectedCategoryId={selectedCategoryId}
                            onCategorySelect={handleCategorySelect}
                            onClose={onClose}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}