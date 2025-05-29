"use client"

import { useState } from "react"
import {ProductEditModal} from "@/features/create-product/ui/product-edit-modal";
import {ProductCard} from "@/features/create-product/ui/product-card";
import {Item} from "@prisma/client";


interface Product {
    id: number
    name: string
    price: string
    photo: string
    description: string | null
    categoryId: number | null
    type: string[]
    licenseType: string
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string }[]
    category: { id: string; title: string }
}

interface ProductListProps {
    products: Item[]
}

export function ProductList({ products }: ProductListProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleEditClick = (product: Product) => {
        setEditingProduct(product)
        setIsEditModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingProduct(null)
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onEditClick={() => handleEditClick(product)} />
                ))}
            </div>

            {isEditModalOpen && editingProduct && (
                <ProductEditModal product={editingProduct} isOpen={isEditModalOpen} onClose={handleCloseModal} />
            )}
        </div>
    )
}
