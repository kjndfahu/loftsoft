import { TrashLogo } from "@/shared/icons"
import { useCartStore } from "../../../../store/use-cart-store"
import { useState } from "react"

export const CartBtns = ({ selectedItems, setSelectedItems }: { selectedItems: string[], setSelectedItems: (items: string[]) => void }) => {
    const items = useCartStore((state) => state.items)
    const removeItem = useCartStore((state) => state.removeItem)

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(items.map((item) => item.id))
        } else {
            setSelectedItems([])
        }
    }

    const handleDeleteSelected = () => {
        selectedItems.forEach((id) => removeItem(id))
        setSelectedItems([])
    }

    return (
        <div className="flex w-full gap-6">
            <div className="flex items-center gap-[6px]">
                <input
                    className="border-[2px] bg-[#CACDDC]"
                    type="checkbox"
                    checked={items.length > 0 && selectedItems.length === items.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <p className="text-[14px] text-[#161616]">Выбрать все</p>
            </div>
            <div className="flex gap-[6px] cursor-pointer" onClick={handleDeleteSelected}>
                <TrashLogo />
                <p className="text-[14px] text-[#161616]">Удалить выбранное</p>
            </div>
        </div>
    )
}