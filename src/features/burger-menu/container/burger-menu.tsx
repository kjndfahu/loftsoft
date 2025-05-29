import { Sections } from "@/features/burger-menu/ui/sections"
import { AllCategories } from "@/features/burger-menu/ui/all-categories"
import { Rules } from "@/features/burger-menu/ui/rules"
import { FC } from "react"
import { motion } from "framer-motion"

interface Props {
    categories: any[]
    products: Record<number, any[]>
    expandedCategory: number | null
    toggleCategory: (categoryId: number) => void
}

export const BurgerMenu: FC<Props> = ({ categories, expandedCategory, toggleCategory, products }) => {
    return (
        <motion.div
            className="flex flex-col mt-[70px] fixed inset-0 z-[100] min-h-screen px-5 py-6 bg-white w-full"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <AllCategories products={products} categories={categories} expandedCategory={expandedCategory} toggleCategory={toggleCategory} />
            <div className="w-full h-[1px] bg-[#DBDEEF]" />
            <Sections />
            <div className="w-full h-[1px] bg-[#DBDEEF]" />
            <Rules />
        </motion.div>
    )
}