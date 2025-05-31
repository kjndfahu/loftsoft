"use client"

import { useEffect, useState } from "react"
import { TitleDesc } from "@/shared/title-desc"
import { NavBtn } from "@/features/home/ui/nav-btn"
import { Items } from "@/features/home/ui/item"
import Link from "next/link"
import {getPopularProducts} from "@/enteties/popular-products/popular-products";

export type PopularProduct = {
    id: number;
    itemId: number;
    position: number;
    item: {
        id: number;
        name: string;
        price: string;
        photo: string;
        category: {
            id: number;
            name: string;
        };
        averageRating?: number;
        purchaseCount?: number;
    };
};

export const PopularItems = () => {
    const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                setIsLoading(true)
                const response = await getPopularProducts()

                if (response.success) {
                    setPopularProducts(response.popularProducts)
                } else {
                    setError(response.error || "Не удалось загрузить популярные товары")
                }
            } catch (err) {
                setError("Произошла ошибка при загрузке популярных товаров")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPopularProducts()
    }, [])

    return (
        <div className="flex flex-col items-center mds:gap-10 gap-6">
            <TitleDesc title="Популярные товары" description="Выберите нужный товар" />

            {isLoading ? (
                <div className="grid md:grid-cols-4 grid-cols-2 justify-between md:gap-6 gap-4 w-full">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="w-full bg-gray-200 rounded-[16px]" style={{ aspectRatio: "312/415" }}></div>
                            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
                <div className="grid md:grid-cols-4 grid-cols-2 justify-between md:gap-6 gap-4 w-full">
                    {popularProducts.length > 0 ? (
                        popularProducts.map((popularProduct) => (
                            <Items
                                key={popularProduct.id}
                                product={{
                                    id: popularProduct.item.id,
                                    name: popularProduct.item.name,
                                    price: popularProduct.item.price,
                                    photo: popularProduct.item.photo,
                                    category: popularProduct.item.category.name,
                                    averageRating: popularProduct.item.averageRating,
                                    purchaseCount: popularProduct.item.purchaseCount
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">Популярные товары не найдены</div>
                    )}
                </div>
            )}

            <Link className="flex items-center justify-center w-full" href="/catalog">
                <NavBtn text="Подробнее" />
            </Link>
        </div>
    )
}
