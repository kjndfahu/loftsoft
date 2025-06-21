// /src/app/catalog/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { BreadcrumbNav } from "@/shared/breadcrumb-nav";
import { CategoryFilter } from "@/features/catalog/container/container-filters";
import { ItemsGrid, Product, Category } from "@/features/home/ui/items-grid";
import { getProductsByCategory } from "@/enteties/product/product";
import { getCategories } from "@/enteties/category/category";

export default function CatalogPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const categoriesData = await getCategories();
                setCategories(categoriesData);

                const productsResponse = await getProductsByCategory(null);
                if (productsResponse.success) {
                    setProducts(productsResponse.products);
                } else {
                    throw new Error(productsResponse.error || "Failed to fetch products");
                }
            } catch (error: any) {
                console.error("Error fetching data:", error.message, error.stack);
                setError("Не удалось загрузить каталог. Попробуйте снова.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProductsChange = useCallback((newProducts: Product[]) => {
        setProducts(newProducts);
    }, []);

    return (
        <div className="flex flex-col pb-20 md:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] md:px-[100px] sm:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Каталог" />

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
                    {error}
                </div>
            )}

            {isLoading ? (
                <>
                    <div className="flex md:items-center justify-between md:flex-row flex-col md:gap-6 gap-3 w-full">
                        <div className="flex flex-row gap-[10px]">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse flex items-center gap-2">
                                    <div className="h-9 bg-gray-200 rounded-full w-32"></div>
                                </div>
                            ))}
                        </div>
                        <div className="sm:w-[250px] w-full bg-gray-200 animate-pulse rounded-full h-10"></div>
                    </div>

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
                </>
            ) : (
                <>
                    <CategoryFilter categories={categories} onProductsChange={handleProductsChange} />
                    {products.length === 0 ? (
                        <div className="text-center py-10">Продукты не найдены</div>
                    ) : (
                        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 w-full">
                            <ItemsGrid products={products} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}