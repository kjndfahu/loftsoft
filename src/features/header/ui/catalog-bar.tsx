"use client"

interface CatalogBarProps {
    categories: {
        id: number
        photo: string
        title: string
        description: string
        createdAt: Date
        updateAt: Date
    }[]
    onCategorySelect: (categoryId: number) => void
    selectedCategoryId: number | null
}

export const CatalogBar = ({ categories, onCategorySelect, selectedCategoryId }: CatalogBarProps) => {
    return (
        <div className="flex flex-col w-[280px] border-r-[1px] border-r-[#c5cffd]">
            <div className="text-[14px] text-[#6A6B75] font-medium px-4 py-[11px]">Все товары</div>

            {categories.length === 0 ? (
                <div className="px-4 py-[11px] text-[14px] text-[#6A6B75]">Категории не найдены</div>
            ) : (
                categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={`${selectedCategoryId === category.id
                            ? "bg-[#F5F7FF] rounded-r-[8px] border-r-[4px] border-[#5069E8]"
                            : "bg-white"
                        } cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}
                    >
                        {category.title}
                    </div>
                ))
            )}
        </div>
    )
}