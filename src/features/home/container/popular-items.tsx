"use client"

import { useEffect, useState } from "react"
import { TitleDesc } from "@/shared/title-desc"
import { NavBtn } from "@/features/home/ui/nav-btn"
import { ItemsGrid, Product } from "@/features/home/ui/items-grid"
import Link from "next/link"
import { getPopularProducts } from "@/enteties/popular-products/popular-products"

export const PopularItems = () => {
    const [popularProducts, setPopularProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                setIsLoading(true)
                const response = await getPopularProducts()

                if (response.success) {
                    // Маппинг данных для соответствия интерфейсу Product
                    const mappedProducts: Product[] = response.popularProducts.map((p: any) => ({
                        id: p.item.id,
                        name: p.item.name,
                        pricesByDuration: p.item.pricesByDuration.map((price: any) => ({
                            durationId: price.durationId,
                            price: JSON.parse(price.price as string) || { regular: "0", discounted: "0" },
                        })),
                        photos: p.item.photos || [],
                        description: p.item.description || null,
                        categoryId: p.item.category?.id || null,
                        type: p.item.type || [],
                        licenseType: p.item.licenseType || [],
                        deviceCounts: p.item.deviceCounts || [],
                        createdAt: p.item.createdAt,
                        updatedAt: p.item.updatedAt,
                        category: p.item.category
                            ? { id: p.item.category.id, title: p.item.category.title, photo: "", description: "", createdAt: new Date(), updateAt: new Date() }
                            : null,
                        characteristics: p.item.characteristics || [],
                        distributives: p.item.distributives || [],
                        averageRating: p.item.averageRating || 0,
                        purchaseCount: p.item.purchaseCount || 0,
                        reviews: p.item.reviews || [],
                    }))
                    setPopularProducts(mappedProducts)
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
                <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 w-full">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div
                                className="w-full bg-gray-200 rounded-[16px]"
                                style={{ aspectRatio: "312/415" }}
                            ></div>
                            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
                <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 w-full">
                    <ItemsGrid products={popularProducts} />
                </div>
            )}

            <Link className="flex items-center justify-center w-full" href="/catalog">
                <NavBtn text="Подробнее" />
            </Link>
        </div>
    )
}