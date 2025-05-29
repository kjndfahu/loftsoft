"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { FC } from "react";
import Link from "next/link";

interface Props {
    categories: any[];
    products: Record<number, any[]>;
    expandedCategory: number | null;
    toggleCategory: (categoryId: number) => void;
}

export const AllCategories: FC<Props> = ({ categories, expandedCategory, toggleCategory, products }) => {
    return (
        <div className="flex flex-col pb-6 gap-4">
            <h2 className="font-normal text-[13px] leading-[17px] text-[#6A6B75]">Все категории</h2>
            <div className="flex flex-col gap-2">
                {categories.map((category) => (
                    <div key={category.id} className="flex flex-col">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleCategory(category.id)}
                        >
                            <p className="text-[20px] leading-6 text-[#161616] font-medium">{category.title}</p>
                            {expandedCategory === category.id ? (
                                <ChevronUp className="w-5 h-5 text-[#161616]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[#161616]" />
                            )}
                        </div>

                        {expandedCategory === category.id && (
                            <div className="flex flex-col mt-2 ml-1 gap-2">
                                {!products[category.id] || products[category.id].length === 0 ? (
                                    <div className="animate-pulse w-full rounded-[16px] h-[20px] bg-[#F5F7FF]"></div>
                                ) : (
                                    products[category.id].map((product) => (
                                        <Link key={product.id} href={`/catalog/${product.id}`}>
                                            <p className="text-[16px] leading-5 text-[#161616]">
                                                {product.name}
                                            </p>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}