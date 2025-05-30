'use client'

import { CreateCategoryBtn } from "@/features/create-category/ui/create-category-btn"
import { CategoryBlock } from "@/features/create-category/ui/category-block"
import { getCategories } from "@/enteties/category/category"
import { useEffect, useState } from "react"
import { Category } from "@/features/home/ui/items-grid"

export default function CreateCategoryPage() {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories()
                setCategories(categoriesData)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchData()
    }, [])

    // Callback to add a new category to the state
    const handleCategoryCreated = (newCategory: Category) => {
        setCategories((prevCategories) => [...prevCategories, newCategory])
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Категории:</h1>
                <CreateCategoryBtn onCategoryCreated={handleCategoryCreated} />
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-[18px] text-[#4E4F56]">Категории еще не созданы</p>
                    <p className="text-[14px] text-[#4E4F56] mt-2">
                        Создайте первую категорию
                    </p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-5">
                    {categories.map((category: {id: number, photo: string, title: string, description: string, createdAt: Date, updateAt: Date}) => (
                        <CategoryBlock key={category.id} category={category} />
                    ))}
                </div>
            )}
        </div>
    )
}