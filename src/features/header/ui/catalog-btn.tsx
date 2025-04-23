"use client"

import { ThreeLines } from "@/shared/icons"
import { useState } from "react"
import { OpenSearchBar } from "@/features/header/ui/open-search-bar"
import { AnimatePresence, motion } from "framer-motion"

export const CatalogBtn = () => {
    const [isOpen, setIsOpen] = useState(false)

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

                        <OpenSearchBar />
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
