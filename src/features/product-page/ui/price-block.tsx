"use client"

import { useCartStore } from "../../../../store/use-cart-store"
import { Logos } from "@/shared/icons"
import { showToast } from "@/shared/custom-toast"

interface PriceBlockProps {
    price?: string
    id?: string
    name?: string
    photo?: string
    type?: string
    licenseType?: string
    deviceCount?: number
}

export const PriceBlock = ({
                               price,
                               id = "default-id",
                               name = "Лицензионный ключ",
                               photo,
                               type,
                               licenseType,
                               deviceCount,
                           }: PriceBlockProps) => {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem({
            id,
            name,
            price: price ? Number(price) : 0,
            photo,
            type,
            licenseType,
            deviceCount,
        })
        showToast("Успешно отправлено!", "success", {
            secondaryMessage: "Товар добавлен в корзину.",
        })
    }

    const displayedPrice = price ? Number(price) : 0

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[30px] md:p-6 p-4">
            <div className="flex items-end gap-2">
                <h4 className="md:text-[36px] md:leading-[40px] text-[27px] leading-[30px] font-semibold text-[#161616]">
                    {displayedPrice.toLocaleString("ru-RU")} ₽
                </h4>
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