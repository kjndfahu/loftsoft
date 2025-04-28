"use client"

import { CartPriceBlock } from "@/features/cart/ui/cart-price-block"
import { CartItemInfo } from "@/features/cart/ui/cart-item-info"
import { TrashLogo } from "@/shared/icons"
import {useCartStore} from "../../../../store/use-cart-store";


export const CartBlock = () => {
    // This is a temporary solution - we'll need to update this component to accept an item prop
    const removeItem = useCartStore((state) => state.removeItem)

    const handleRemove = () => {
        // For now, we'll just use a placeholder ID
        // removeItem("placeholder-id")
    }

    return (
        <div className="flex items-start justify-between">
            <CartItemInfo />
            <CartPriceBlock />
            <div onClick={handleRemove}>
                <TrashLogo className="cursor-pointer" />
            </div>
        </div>
    )
}
