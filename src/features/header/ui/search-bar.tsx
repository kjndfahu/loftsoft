// search-bar.tsx
"use client"

import type React from "react"
import { SearchLogo } from "@/shared/icons"
import { FC, useState } from "react"
import { SearchResults } from "@/features/header/ui/search-results"
import { useCatalog } from "@/features/header/catalog-context"
import { SoftRequestForm } from "@/features/header/ui/soft-request-form"
import { Modal } from "@/shared/modal"

interface Category {
    id: number
    photo: string
    title: string
    description: string
    createdAt: Date
    updateAt: Date
}

interface Props {
    categories: Category[]
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const SearchBar: FC<Props> = ({ isOpen, onOpen, onClose, categories }) => {
    const [showForm, setShowForm] = useState(false)
    const { filteredCategories, filteredProducts, isLoading, searchQuery, setSearchQuery, fetchData } = useCatalog()

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        if (e.target.value.trim() !== "") {
            onOpen()
        }
    }

    const handleInputFocus = () => {
        onOpen()
        if (filteredProducts.length === 0 && !isLoading) {
            fetchData()
        }
    }

    return (
        <div className="relative">
            <div className="flex items-center justify-between mdbvp:w-[666px] md:w-[400px] mds:w-[260px] w-full border-[1px] border-[#DBDEEF] mds:text-[16px] text-[12px] rounded-full mds:py-3 py-2 md:px-6 px-2 relative z-50">
                <input
                    placeholder="Искать тут.."
                    className="text-[#4E4F56] w-full outline-0"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleInputFocus}
                />
                <SearchLogo />
            </div>

            <SearchResults
                categories={filteredCategories}
                products={filteredProducts}
                isOpen={isOpen}
                setIsOpen={(open) => { if (!open) onClose(); else onOpen(); }}
                isLoading={isLoading}
                searchQuery={searchQuery}
                setShowForm={setShowForm}
            />

            {showForm && (
                <Modal setModalOpen={setShowForm} form={<SoftRequestForm setIsClicked={setShowForm} />} />
            )}
        </div>
    )
}