import { PopularProductBlock } from "@/features/popular-products/ui/popular-product-block"

import { Suspense } from "react"
import {getPopularProducts} from "@/enteties/popular-products/popular-products";

async function PopularProductsGrid() {
    const { popularProducts = [], success } = (await getPopularProducts()) || {}

    if (!success) {
        return <div className="text-red-500">Failed to load popular products</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-between w-full">
            {popularProducts.map((product) => (
                <PopularProductBlock key={product.id} product={product} />
            ))}
            {popularProducts.length < 4 && <PopularProductBlock />}
        </div>
    )
}

export default function PopularProductsPage() {
    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Популярные товары:</h1>
            </div>
            <Suspense fallback={<div className="text-center py-10">Loading popular products...</div>}>
                <PopularProductsGrid />
            </Suspense>
        </div>
    )
}
