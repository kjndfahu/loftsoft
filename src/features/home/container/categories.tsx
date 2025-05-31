"use client"

import { TitleDesc } from "@/shared/title-desc"
import { CategoryBlock } from "@/features/home/ui/category-block"
import { NavBtn } from "@/features/home/ui/nav-btn"

import Link from "next/link"
import {useCatalog} from "@/features/header/catalog-context";

export const Categories = () => {
    const { filteredCategories } = useCatalog() // Access filteredCategories from context
    const categories = filteredCategories.slice(0, 3)
    return (
        <div className="flex flex-col items-center mds:gap-10 gap-6">
            <TitleDesc title="Категории товаров" description="Выберите нужную категорию" />
            <div className="grid md:grid-cols-3 mds:grid-cols-2 grid-cols-1 gap-6 justify-between w-full">
                {categories.map((category: {
                    id: number;
                    photo: string;
                    title: string;
                    description: string;
                    createdAt: Date;
                    updateAt: Date;
                }) => (
                    <CategoryBlock
                        key={category.id}
                        title={category.title}
                        description={category.description}
                        photo={category.photo}
                    />
                ))}
            </div>
            <Link className="w-full" href="/catalog">
                <NavBtn text="Все категории" />
            </Link>
        </div>
    )
}