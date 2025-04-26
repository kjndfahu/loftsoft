import {Items} from "@/features/home/ui/item";

export interface Product {
    id: number
    name: string
    price: string
    photo: string
    description?: string | null
    categoryId?: number | null
    type: string[]
    licenseType: string
    createdAt: Date
    updatedAt: Date
    category?: any
    characteristics: any[]
    distributives: any[]
}

export const ItemsGrid = ({ products }: { products: Product[] }) => {
    return (
        <>
            {products.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-xl font-medium text-gray-500">Товары не найдены</p>
                    <p className="text-gray-400">Попробуйте изменить параметры фильтрации</p>
                </div>
            ) : (
                products.map((product) => <Items key={product.id} product={product} />)
            )}
        </>
    )
}