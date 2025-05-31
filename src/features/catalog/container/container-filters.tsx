"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CategoryTabs, CategoryTab } from "@/features/catalog/ui/container-tabs";
import FilterPopup from "@/features/catalog/ui/filter-popup";
import { getSortedProducts } from "@/enteties/product/product";
import { Product } from "@/features/home/ui/items-grid";

interface Props {
    categories: CategoryTab[];
    onProductsChange: (products: Product[]) => void;
}

export function CategoryFilter({ categories, onProductsChange }: Props) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>("price_asc");
    const [products, setProducts] = useState<Product[]>([]);

    const isFirstRender = useRef(true);
    const prevCategoryId = useRef<number | null>(null);
    const prevFilter = useRef<string>("price_asc");

    const filterOptions = [
        { id: "rating", label: "По рейтингу" },
        { id: "popularity", label: "По популярности" },
        { id: "purchases", label: "По количеству покупок" },
        { id: "price_asc", label: "По возрастанию цены" },
        { id: "price_desc", label: "По убыванию цены" },
    ];

    const sortProducts = useCallback((products: Product[], filter: string): Product[] => {
        const sortedProducts = [...products]; // Create a copy to avoid mutating state
        switch (filter) {
            case "rating":
                return sortedProducts.sort((a, b) => b.averageRating - a.averageRating);
            case "popularity":
                return sortedProducts.sort((a, b) => b.purchaseCount - a.purchaseCount);
            case "purchases":
                return sortedProducts.sort((a, b) => b.purchaseCount - a.purchaseCount);
            case "price_asc":
                return sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            case "price_desc":
                return sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            default:
                return sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, []);

    const fetchProducts = useCallback(
        async (categoryId: number | null, filter: string) => {
            if (categoryId === prevCategoryId.current && filter === prevFilter.current) {
                return;
            }

            prevCategoryId.current = categoryId;
            prevFilter.current = filter;

            setIsLoading(true);
            try {
                const result = await getSortedProducts(categoryId, filter);
                if (result.success && result.products) {
                    // Store fetched products and sort them locally
                    const sortedProducts = sortProducts(result.products, filter);
                    setProducts(sortedProducts);
                    onProductsChange(sortedProducts);
                } else {
                    console.error("Failed to fetch products:", result.error);
                    setProducts([]);
                    onProductsChange([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
                onProductsChange([]);
            } finally {
                setIsLoading(false);
            }
        },
        [onProductsChange, sortProducts],
    );

    const handleCategoryChange = useCallback(
        (categoryTitle: string) => {
            setActiveCategory(categoryTitle);

            let categoryId = null;
            if (categoryTitle !== "all") {
                const category = categories.find((cat) => cat.title === categoryTitle);
                categoryId = category ? category.id : null;
            }

            setActiveCategoryId(categoryId);
        },
        [categories],
    );

    const handleFilterSelect = useCallback(
        (option: { id: string; label: string }) => {
            setSelectedFilter(option.id);
            // Re-sort the existing products when filter changes
            const sortedProducts = sortProducts(products, option.id);
            setProducts(sortedProducts);
            onProductsChange(sortedProducts);
        },
        [products, sortProducts, onProductsChange],
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchProducts(null, selectedFilter);
            return;
        }

        const timer = setTimeout(() => {
            fetchProducts(activeCategoryId, selectedFilter);
        }, 300);

        return () => clearTimeout(timer);
    }, [activeCategoryId, selectedFilter, fetchProducts]);

    return (
        <div className="flex mds:flex-row flex-col mds:gap-10 gap-3 justify-between mds:items-center">
            <CategoryTabs tabs={categories} activeTab={activeCategory} onChange={handleCategoryChange} />
            <div className="sm:w-[250px] w-full bg-white rounded-xl">
                <FilterPopup
                    title="Фильтрация"
                    options={filterOptions}
                    onSelect={handleFilterSelect}
                    defaultSelected={selectedFilter}
                />
            </div>
        </div>
    );
}