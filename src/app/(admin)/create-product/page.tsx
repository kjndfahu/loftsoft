import { getProductsByCategory } from "@/enteties/product/product"

import { CreateProductBtn } from "@/features/create-product/ui/create-product-btn"
import {ProductList} from "@/features/create-product/container/product-list";

export default async function ProductsPage() {
    // Fetch all products
    const { products = [] } = await getProductsByCategory() || { products: [] }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full gap-5">
            <div className="flex items-center justify-between mb-6">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Товары:</h1>
                <CreateProductBtn />
            </div>

            {products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    Товары не найдены. Создайте новый товар, нажав на кнопку выше.
                </div>
            ) : (
                <ProductList products={products} />
            )}
        </div>
    )
}
