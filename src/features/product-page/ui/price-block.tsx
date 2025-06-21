// price-block.tsx
"use client"

import { useCartStore } from "../../../../store/use-cart-store"
import { Logos } from "@/shared/icons"
import { showToast } from "@/shared/custom-toast"

interface PriceBlockProps {
    regularPrice?: string
    discountedPrice?: string
    id?: string
    name?: string
    photo?: string
    type?: string
    licenseType?: string
    deviceCount?: number
    discountPercentage?: number
    savings?: string
}

export const PriceBlock = ({
                               regularPrice = "0",
                               discountedPrice = "0",
                               id = "default-id",
                               name = "Лицензионный ключ",
                               photo,
                               type,
                               licenseType,
                               deviceCount,
                               discountPercentage = 0,
                               savings = "0",
                           }: PriceBlockProps) => {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem({
            id,
            name,
            price: parseFloat(discountedPrice),
            photo,
            type,
            licenseType,
            deviceCount,
        })
        showToast("Успешно отправлено!", "success", {
            secondaryMessage: "Товар добавлен в корзину.",
        })
    }

    const regularNum = parseFloat(regularPrice)
    const discountedNum = parseFloat(discountedPrice)

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[20px] md:p-6 p-4">
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-baseline gap-2">
                    <h4 className="md:text-[36px] md:leading-[40px] text-[27px] leading-[30px] font-semibold text-[#161616]">
                        {discountedNum.toLocaleString("ru-RU")} ₽
                    </h4>
                    <span className="text-[16px] text-red-500">-{discountPercentage}%</span>
                    <span className="text-[20px] text-gray-500">/ {regularNum.toLocaleString("ru-RU")} ₽</span>
                </div>
            </div>
            <div className="flex flex-col w-full items-center self-center gap-[12px]">
                <button
                    onClick={handleAddToCart}
                    className="rounded-full py-[10px] w-full text-[16px] text-white font-semibold bg-[#5069E8]"
                >
                    Добавить в корзину
                </button>
                <div className="flex justify-center gap-2">
                    <Logos name="visa" className="w-6 h-6 text-gray-400" />
                    <Logos name="mastercard" className="w-6 h-6 text-gray-400" />
                    <Logos name="mir" className="w-6 h-6 text-gray-400" />
                    <Logos name="applePay" className="w-6 h-6 text-gray-400" />
                </div>
            </div>
        </div>
    )
}