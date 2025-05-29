import { Items } from "@/features/home/ui/item";

export interface Category {
    id: number;
    photo: string;
    title: string;
    description: string;
    createdAt: Date;
    updateAt: Date;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    photo: string;
    description?: string | null;
    categoryId?: number | null;
    type: string[];
    licenseType: string;
    createdAt: Date;
    updatedAt: Date;
    category?: Category | null;
    characteristics: any[];
    distributives: any[];
    averageRating: number;
    purchaseCount: number;
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
    );
};