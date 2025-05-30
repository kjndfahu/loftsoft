"use client"

import { AnimatePresence, motion } from "framer-motion"
import { FC, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Modal } from "@/shared/modal"
import { SoftRequestForm } from "@/features/header/ui/soft-request-form"

interface Category {
    id: number
    photo: string
    title: string
    description: string
    createdAt: Date
    updateAt: Date
}

interface Product {
    id: number
    name: string
    price: string
    photo: string
    description: string
    categoryId: number
    category: Category
    characteristics: any[]
    distributives: any[]
}

interface Props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    categories: Category[]
    products: Product[]
    isLoading: boolean
    searchQuery: string
}

export const SearchResults: FC<Props> = ({ isOpen, setIsOpen, categories, products, isLoading, searchQuery }) => {
    const [showForm, setShowForm] = useState(false)

    const clipVariants = {
        hidden: {
            clipPath: "inset(0 0 100% 0 round 0 0 8px 8px)",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        visible: {
            clipPath: "inset(0 0 0 0 round 0 0 8px 8px)",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        exit: {
            clipPath: "inset(0 0 100% 0 round 0 0 8px 8px)",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    }

    // Limit to maximum 3 categories and 3 products
    const limitedCategories = categories.slice(0, 3)
    const limitedProducts = products.slice(0, 3)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed mds:top-[135px] top-[71px] inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute top-[60px] left-0 w-full rounded-b-lg shadow-lg z-50 overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={clipVariants}
                        />
                        <motion.div
                            className="relative py-4"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={clipVariants}
                        >
                            <div className="px-4 text-black">
                                {isLoading ? (
                                    <div className="py-8 text-center">
                                        <p>Загрузка результатов...</p>
                                    </div>
                                ) : (
                                    <>
                                        {searchQuery.trim() === "" ? (
                                            <>
                                                <h3 className="font-bold text-[18px] mb-2">Категории</h3>
                                                <div className="mb-4">
                                                    {limitedCategories.map((category) => (
                                                        <Link href={`/catalog`} key={category.id} onClick={() => setIsOpen(false)}>
                                                            <p className="py-2 hover:bg-gray-50 text-[16px] font-medium cursor-pointer">
                                                                {category.title}
                                                            </p>
                                                        </Link>
                                                    ))}
                                                </div>

                                                <h3 className="font-bold text-[18px] mb-2">Товары</h3>
                                                {limitedProducts.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {limitedProducts.map((product) => (
                                                            <Link href={`/catalog/${product.id}`} key={product.id} onClick={() => setIsOpen(false)}>
                                                                <div className="flex items-center gap-2 py-2 hover:bg-gray-50 cursor-pointer">
                                                                    <div className="w-10 h-10 flex-shrink-0 relative overflow-hidden rounded-sm">
                                                                        <Image
                                                                            src={product.photo || "/placeholder.svg"}
                                                                            alt={product.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium">{product.name}</p>
                                                                        <p className="text-xs text-gray-500">{product.category?.title || "Категория"}</p>
                                                                        <p className="text-xs font-semibold">{product.price} ₽</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center">
                                                        <p className="text-gray-500">Загрузка товаров...</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {limitedCategories.length > 0 && (
                                                    <>
                                                        <h3 className="font-bold text-[18px] mb-2">Категории</h3>
                                                        <div className="mb-4">
                                                            {limitedCategories.map((category) => (
                                                                <Link
                                                                    href={`/category/${category.id}`}
                                                                    key={category.id}
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    <p className="py-2 hover:bg-gray-50 text-[16px] font-medium cursor-pointer">
                                                                        {category.title}
                                                                    </p>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {limitedProducts.length > 0 ? (
                                                    <>
                                                        <h3 className="font-bold text-[18px] mb-2">Товары</h3>
                                                        <div className="space-y-2">
                                                            {limitedProducts.map((product) => (
                                                                <Link href={`/catalog/${product.id}`} key={product.id} onClick={() => setIsOpen(false)}>
                                                                    <div className="flex items-center gap-2 py-2 hover:bg-gray-50 cursor-pointer">
                                                                        <div className="w-10 h-10 flex-shrink-0 relative overflow-hidden rounded-sm">
                                                                            <Image
                                                                                src={product.photo || "/placeholder.svg"}
                                                                                alt={product.name}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-medium">{product.name}</p>
                                                                            <p className="text-xs text-gray-500">{product.category?.title || "Категория"}</p>
                                                                            <p className="text-xs font-semibold">{product.price} ₽</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div></div>
                                                )}

                                                {limitedCategories.length === 0 && limitedProducts.length === 0 && !isLoading && searchQuery.trim() !== "" && (
                                                    <div className="pb-[20px] flex flex-col">
                                                        <h3 className="sm:text-[20px] text-[16px] font-semibold">Ничего не найдено</h3>
                                                        <p className="sm:text-[14px] text-[12px] text-[#8B8B8B] mb-6">Попробуйте изменить запрос или поискать в каталоге.</p>
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            <Link
                                                                href="/catalog"
                                                                onClick={() => setIsOpen(false)}
                                                                className="flex items-center bg-black text-white px-6 h-[42px] rounded-full font-medium"
                                                            >
                                                                Перейти в каталог
                                                            </Link>
                                                            <button
                                                                onClick={() => setShowForm(true)}
                                                                className="flex items-center border border-gray-300 px-6 h-[42px] rounded-full font-medium"
                                                            >
                                                                Запросить товар
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {showForm && (
                                <Modal form={<SoftRequestForm setIsClicked={setShowForm} />} />
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}