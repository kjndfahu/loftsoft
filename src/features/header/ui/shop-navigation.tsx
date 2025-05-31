"use client";

import { BoxLogo, BurgerMenuLogo, CartLogo, CrossLogo, SearchLogo, UserLogo } from "@/shared/icons";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/shared/modal";
import { LoginForm } from "@/features/auth/container/login-form";
import { SignUpForm } from "@/features/auth/container/sign-up-form";
import { RestorePasswordForm } from "@/features/auth/container/restore-password-form";
import { BurgerMenu } from "@/features/burger-menu/container/burger-menu";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SearchBar } from "@/features/header/ui/search-bar";
import { useSearch } from "@/features/header/search-context";
import { useCartStore } from "../../../../store/use-cart-store";
import { useAuth } from "@/enteties/auth/auth-provider";
import {useCatalog} from "@/features/header/catalog-context";


export const ShopNavigation = () => {
    const { user, refreshUser } = useAuth();
    const items = useCartStore((state) => state.items);
    const { isSearchOpen, setIsSearchOpen } = useSearch();
    const { categories, fetchData, allProducts } = useCatalog(); // Use context for categories and fetchData
    const [isAuth, setIsAuth] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [isBurgerMenu, setIsBurgerMenu] = useState(false);
    const [products, setProducts] = useState<Record<number, any[]>>({}); // Keep local products state
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const pathname = usePathname();

    const fetchProductsForCategory = useCallback(
        async (categoryId: number) => {
            try {
                if (products[categoryId]) return;

                // Use allProducts from context if categoryId is null, else filter by categoryId
                const resultProducts = categoryId
                    ? allProducts.filter((product) => product.categoryId === categoryId)
                    : allProducts;

                setProducts((prev) => ({
                    ...prev,
                    [categoryId]: resultProducts,
                }));
            } catch (error) {
                console.error(`Error fetching products for category ${categoryId}:`, error);
            }
        },
        [allProducts, products]
    );

    const toggleCategory = useCallback(
        (categoryId: number) => {
            if (expandedCategory === categoryId) {
                setExpandedCategory(null);
            } else {
                setExpandedCategory(categoryId);
                fetchProductsForCategory(categoryId);
            }
        },
        [expandedCategory, fetchProductsForCategory]
    );

    useEffect(() => {
        setIsBurgerMenu(false);
        setIsSearchOpen(false);
    }, [pathname, setIsSearchOpen]);

    const handleRegistrationClick = useCallback(() => {
        setIsAuth(false);
        setForgotPassword(false);
        setIsRegistration(true);
    }, []);

    const handleLoginClick = useCallback(() => {
        setIsRegistration(false);
        setForgotPassword(false);
        setIsAuth(true);
    }, []);

    const handleRestoreClick = useCallback(() => {
        setIsRegistration(false);
        setIsAuth(false);
        setForgotPassword(true);
    }, []);

    useEffect(() => {
        if (!isDataLoaded) {
            fetchData().then(() => setIsDataLoaded(true)); // Fetch categories and products from context
        } else {
            categories.forEach((category) => {
                if (!products[category.id]) {
                    fetchProductsForCategory(category.id);
                }
            });
        }
    }, [isDataLoaded, categories, fetchProductsForCategory, fetchData]);

    const burgerMenuComponent = useMemo(() => {
        return (
            <AnimatePresence>
                {isBurgerMenu && (
                    <BurgerMenu
                        products={products}
                        categories={categories}
                        expandedCategory={expandedCategory}
                        toggleCategory={toggleCategory}
                    />
                )}
            </AnimatePresence>
        );
    }, [isBurgerMenu, products, categories, expandedCategory, toggleCategory]);

    return (
        <div className={`flex ${isSearchOpen ? "w-full" : "w-auto"} items-center md:gap-5 mds:gap-2 sm:gap-5 gap-3 text-[12px] text-[#858692] relative`}>
            {!isSearchOpen && (
                <div
                    className="mds:hidden flex items-center cursor-pointer flex-col gap-1"
                    onClick={() => setIsSearchOpen(true)}
                >
                    <SearchLogo color="#161616" />
                </div>
            )}

            {isSearchOpen && (
                <div className="w-full bg-white-1 flex items-center justify-center z-50">
                    <div className="w-full">
                        <SearchBar categories={categories} />
                    </div>
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute top-2 right-2 z-[51] text-gray-500"
                    >
                        <CrossLogo className="w-6 h-6" />
                    </button>
                </div>
            )}

            {!isSearchOpen && (
                <>
                    <Link href="/cart">
                        <div className="mds:hidden flex relative items-center cursor-pointer flex-col gap-1">
                            <CartLogo />
                            {items.length !== 0 && (
                                <div
                                    className="absolute bg-[#5069E8] text-[#ffffff] top-[-13px] right-[-10px] border-[2px] border-white font-extrabold rounded-full px-2">{items.length}</div>
                            )}
                        </div>
                    </Link>
                    {user ? (
                        <Link href="/profile">
                            <div className="flex items-center cursor-pointer flex-col gap-1">
                                <UserLogo color="#161616" />
                                <p className="mds:flex hidden">Профиль</p>
                            </div>
                        </Link>
                    ) : (
                        <div onClick={() => setIsAuth(true)} className="flex items-center cursor-pointer flex-col gap-1">
                            <UserLogo color="#161616" />
                            <p className="mds:flex hidden">Войти</p>
                        </div>
                    )}
                    <Link className="mds:flex hidden" href="/orders">
                        <div className="flex relative items-center cursor-pointer flex-col gap-1">
                            <BoxLogo color="#161616"/>
                            <p className="mds:flex hidden">Заказы</p>
                        </div>
                    </Link>
                    <div
                        onClick={() => setIsBurgerMenu(!isBurgerMenu)}
                        className="mds:hidden flex items-center cursor-pointer flex-col gap-1"
                    >
                        {isBurgerMenu ? (
                            <CrossLogo className="w-6 h-6 text-gray-500 cursor-pointer" />
                        ) : (
                            <BurgerMenuLogo />
                        )}
                    </div>
                    <Link href="/cart">
                        <div className="mds:flex hidden relative items-center cursor-pointer flex-col gap-1">
                            <CartLogo/>
                            {items.length !== 0 && (
                                <div
                                    className="absolute bg-[#5069E8] text-[#ffffff] top-[-13px] right-[-10px] border-[2px] border-white font-extrabold rounded-full px-2">{items.length}</div>
                            )}
                            <p className="mds:flex hidden">Корзина</p>
                        </div>
                    </Link>
                </>
            )}

            {burgerMenuComponent}

            {isAuth && (
                <Modal
                    form={
                        <LoginForm
                            handleRegistrationClick={handleRegistrationClick}
                            handleRestoreClick={handleRestoreClick}
                            setIsAuth={setIsAuth}
                            refreshUser={refreshUser}
                        />
                    }
                />
            )}

            {isRegistration && (
                <Modal
                    form={
                        <SignUpForm
                            handleLoginClick={handleLoginClick}
                            setIsRegistration={setIsRegistration}
                            refreshUser={refreshUser}
                        />
                    }
                />
            )}

            {forgotPassword && (
                <Modal
                    form={<RestorePasswordForm handleLoginClick={handleLoginClick} setForgotPassword={setForgotPassword} />}
                />
            )}
        </div>
    );
};