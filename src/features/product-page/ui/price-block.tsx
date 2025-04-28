"use client"


import {useCartStore} from "../../../../store/use-cart-store";

type PriceBlockProps = {
    price: string
    id?: string
    name?: string
    photo?: string
    type?: string[]
    licenseType?: string
    oldPrice?: string
}

export const PriceBlock = ({
                               price,
                               id = "default-id",
                               name = "Лицензионный ключ",
                               photo,
                               type,
                               licenseType,
                               oldPrice,
                           }: PriceBlockProps) => {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem({
            id,
            name,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : undefined,
            photo,
            type,
            licenseType,
        })
    }

    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[30px] p-6">
            <h4 className="text-[36px] font-semibold text-[#161616]">{price}₽</h4>
            <div className="flex flex-col gap-[12px]">
                <button
                    onClick={handleAddToCart}
                    className="rounded-full py-[10px] w-[266px] text-[16px] text-white font-semibold bg-[#5069E8]"
                >
                    Добавить в корзину
                </button>
            </div>
        </div>
    )
}
