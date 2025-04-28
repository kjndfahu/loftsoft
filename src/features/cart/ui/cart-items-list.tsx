"use client"


import { ItemType } from "@/features/cart/ui/item-type"
import { CartItemInfo } from "@/features/cart/ui/cart-item-info"
import { CartPriceBlock } from "@/features/cart/ui/cart-price-block"
import { TrashLogo } from "@/shared/icons"
import {useCartStore} from "../../../../store/use-cart-store";

export const CartItemsList = () => {
    const items = useCartStore((state) => state.items)
    const removeItem = useCartStore((state) => state.removeItem)

    // Group items by type
    const groupedItems = items.reduce(
        (acc, item) => {
            const type = item.type?.[0] || "Ключ"
            if (!acc[type]) {
                acc[type] = []
            }
            acc[type].push(item)
            return acc
        },
        {} as Record<string, typeof items>,
    )

    if (items.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-[18px] text-[#858692]">Ваша корзина пуста</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full gap-[20px]">
            {Object.entries(groupedItems).map(([type, typeItems]) => (
                <div key={type} className="flex flex-col gap-[20px]">
                    <ItemType type={type} />
                    {typeItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between">
                            <CartItemInfo name={item.name} photo={item.photo} licenseType={item.licenseType || "1 ПК"} />
                            <CartPriceBlock price={item.price} oldPrice={item.oldPrice} quantity={item.quantity} itemId={item.id} />
                            <div onClick={() => removeItem(item.id)}>
                                <TrashLogo className="cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
