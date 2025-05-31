"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { getCategories } from "@/enteties/category/category";
import { getProductsByCategory, searchProductsAndCategories } from "@/enteties/product/product";

interface Category {
    id: number;
    photo: string;
    title: string;
    description: string;
    createdAt: Date;
    updateAt: Date;
}

interface Product {
    id: number;
    name: string;
    price: string;
    photo: string;
    description: string;
    categoryId: number;
    category?: Category;
    characteristics: any[];
    distributives: any[];
    type?: string[];
    licenseType?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CatalogContextType {
    categories: Category[];
    products: Product[];
    allProducts: Product[];
    isLoading: boolean;
    selectedCategoryId: number | null;
    searchQuery: string;
    filteredCategories: Category[];
    filteredProducts: Product[];
    setSelectedCategoryId: (id: number | null) => void;
    setSearchQuery: (query: string) => void;
    fetchData: () => Promise<void>;
    search: (query: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const categoriesData = await getCategories();
            const categoriesArray = categoriesData || [];
            setCategories(categoriesArray);
            setFilteredCategories(categoriesArray);

            // Only set initial selectedCategoryId if not already set
            if (categoriesArray.length > 0 && selectedCategoryId === null) {
                setSelectedCategoryId(categoriesArray[0].id);
            }

            const productsResult = await getProductsByCategory(null);
            if (productsResult && productsResult.success) {
                const fetchedProducts = productsResult.products || [];
                setAllProducts(fetchedProducts);
                setProducts(fetchedProducts.slice(0, 5));
            } else {
                console.error("Failed to fetch products:", productsResult?.error);
                setAllProducts([]);
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setCategories([]);
            setAllProducts([]);
            setProducts([]);
            setFilteredCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Removed selectedCategoryId from dependencies

    const search = useCallback(
        async (query: string) => {
            setIsLoading(true);
            try {
                if (query.trim()) {
                    const result = await searchProductsAndCategories(query);
                    if (result.success) {
                        setFilteredCategories(result.categories || []);
                        setFilteredProducts(result.products || []);
                    } else {
                        setFilteredCategories([]);
                        setFilteredProducts([]);
                    }
                } else {
                    setFilteredCategories(categories);
                    setFilteredProducts(products);
                }
            } catch (error) {
                console.error("Search error:", error);
                setFilteredCategories([]);
                setFilteredProducts([]);
            } finally {
                setIsLoading(false);
            }
        },
        [categories, products]
    );

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Debounced search
    useEffect(() => {
        let isActive = true;
        const delayDebounceFn = setTimeout(() => {
            if (isActive) {
                search(searchQuery);
            }
        }, 300);

        return () => {
            isActive = false;
            clearTimeout(delayDebounceFn);
        };
    }, [searchQuery, search]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            categories,
            products,
            allProducts,
            isLoading,
            selectedCategoryId,
            searchQuery,
            filteredCategories,
            filteredProducts,
            setSelectedCategoryId,
            setSearchQuery,
            fetchData,
            search,
        }),
        [
            categories,
            products,
            allProducts,
            isLoading,
            selectedCategoryId,
            searchQuery,
            filteredCategories,
            filteredProducts,
            fetchData,
            search,
        ]
    );

    return <CatalogContext.Provider value={contextValue}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error("useCatalog must be used within a CatalogProvider");
    }
    return context;
};