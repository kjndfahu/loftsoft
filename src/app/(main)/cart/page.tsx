'use client'

import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { CartBtns } from "@/features/cart/ui/cart-btns"
import { CartResultInfo } from "@/features/cart/container/cart-result-info"
import { CartItemsList } from "@/features/cart/ui/cart-items-list"
import { useEffect, useState } from "react"
import { getPopularProducts } from "@/enteties/popular-products/popular-products"
import { PopularProduct } from "@/features/home/container/popular-items"
import { Items } from "@/features/home/ui/item"

export default function CartPage() {
    const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedItems, setSelectedItems] = useState<string[]>([])

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
        <div
            className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Корзина"/>
            <CartBtns selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
            <div className="flex mds:flex-row flex-col md:gap-[80px] gap-7">
                <CartItemsList selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                <CartResultInfo />
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-[27px] text-[#161616] font-semibold">Еще может подойти</h3>
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
            </div>
        </div>
    )
}