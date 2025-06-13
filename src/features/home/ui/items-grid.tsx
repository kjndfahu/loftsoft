import { Items } from "@/features/home/ui/item";

export interface Category {
    id: number;
    photo: string;
    title: string;
    description: string;
    createdAt: Date;
    updateAt: Date;
}

// Updated Product interface to match server-side
export interface Product {
    id: number;
    name: string;
    pricesByDuration: { durationId: string; price: string }[];
    photos: string[];
    description?: string | null;
    categoryId?: number | null;
    type: string[];
    licenseType: string[]; // Changed to string[]
    createdAt: Date;
    updatedAt: Date;
    category?: Category | null;
    characteristics: { id: number; title: string; value: string }[];
    distributives: { id: number; displayName: string; fileUrl: string }[];
    averageRating: number;
    purchaseCount: number;
    deviceCounts: number[];
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