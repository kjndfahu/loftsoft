"use client"

import { useState, useEffect, useCallback } from "react"
import { PopularProductBlock } from "@/features/popular-products/ui/popular-product-block"
import { getPopularProducts } from "@/enteties/popular-products/popular-products"

export default function PopularProductsPage() {
    const [popularProducts, setPopularProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPopularProducts = useCallback(async () => {
        try {
            setLoading(true)
            const { popularProducts = [], success } = (await getPopularProducts()) || {}
            if (success) {
                setPopularProducts(popularProducts)
            } else {
                setError("Не удалось загрузить популярные товары")
            }
        } catch (err) {
            setError("Не удалось загрузить популярные товары")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPopularProducts()
    }, [fetchPopularProducts])

    // Expose a function to child components to trigger a refresh
    const handleProductChange = useCallback(() => {
        fetchPopularProducts()
    }, [fetchPopularProducts])

    if (loading) {
        return (
            <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
                <div className="text-center py-10">Загрузка популярных товаров...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
                <div className="text-red-500">Ошибка: {error}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Популярные товары:</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-between w-full">
                {popularProducts.map((product) => (
                    <PopularProductBlock
                        key={product.id}
                        product={product}
                        onProductChange={handleProductChange}
                    />
                ))}
                {popularProducts.length < 4 && <PopularProductBlock onProductChange={handleProductChange} />}
            </div>
        </div>
    )
}