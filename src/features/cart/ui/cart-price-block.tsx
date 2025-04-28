"use client"



import {useCartStore} from "../../../../store/use-cart-store";

export const CartPriceBlock = ({
                                   price = 14599,
                                   oldPrice = 33599,
                                   quantity = 1,
                                   itemId = "placeholder-id",
                               }: {
    price?: number
    oldPrice?: number
    quantity?: number
    itemId?: string
} = {}) => {
    const updateQuantity = useCartStore((state) => state.updateQuantity)

    const handleDecrease = () => {
        updateQuantity(itemId, quantity - 1)
    }

    const handleIncrease = () => {
        updateQuantity(itemId, quantity + 1)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <h4 className="text-[24px] font-medium text-[#161616]">{price}₽</h4>
                {oldPrice && <p className="text-[14px] text-[#858692] line-through">{oldPrice}₽</p>}
            </div>
            <div className="flex text-[16px] text-[#161616] font-semibold gap-6 px-[18px] py-[11px] rounded-full border-[1px] border-[#DBDEEF]">
        <span className="cursor-pointer" onClick={handleDecrease}>
          -
        </span>
                <span>{quantity}</span>
                <span className="cursor-pointer" onClick={handleIncrease}>
          +
        </span>
            </div>
        </div>
    )
}
