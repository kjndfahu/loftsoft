// price-block.tsx
"use client"

import { useCartStore } from "../../../../store/use-cart-store"
import { Logos } from "@/shared/icons"
import {showToast} from "@/shared/custom-toast";


type PriceBlockProps = {
    price?: string
    id?: string
    name?: string
    photo?: string
    type?: string
    licenseType?: string
    deviceCount?: number
    oldPrice: string
}

export const PriceBlock = ({
                               price,
                               id = "default-id",
                               name = "Лицензионный ключ",
                               photo,
                               type,
                               licenseType,
                               deviceCount,
                               oldPrice,
                           }: PriceBlockProps) => {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem({
            id,
            name,
            price: price ? Number(price) : Number(oldPrice),
            oldPrice: Number(oldPrice),
            photo,
            type,
            licenseType,
            deviceCount,
        })
        // Show success toast after adding to cart
        showToast("Успешно отправлено!", "success", {
            secondaryMessage: "Товар добавлен в корзину.",
        })
    }

    const hasDiscount = !!price
    const displayedPrice = price ? Number(price) : Number(oldPrice)
    const originalPrice = Number(oldPrice)
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - displayedPrice) / originalPrice) * 100) : 0

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[30px] mdbvp:p-6 p-4">
            <div className="flex items-end gap-2">
                <h4 className="mdbvp:text-[36px] mdbvp:leading-[40px] text-[27px] leading-[30px] font-semibold text-[#161616]">
                    {displayedPrice}₽
                </h4>
                {hasDiscount && (
                    <div className="flex gap-1 items-center text-[#E71730] text-[16px] font-medium">
                        <div className="flex text-[11px] bg-[#FEECEE] rounded-full px-1.5 py-1">
                            -{discountPercentage}%
                        </div>
                        <p className="text-[#858692] line-through font-medium">/{originalPrice}₽</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full items-center self-center gap-[12px]">
                <button
                    onClick={handleAddToCart}
                    className="rounded-full py-[10px] w-full text-[16px] text-white font-semibold bg-[#5069E8]"
                >
                    Добавить в корзину
                </button>
                <Logos />
            </div>
        </div>
    )
}