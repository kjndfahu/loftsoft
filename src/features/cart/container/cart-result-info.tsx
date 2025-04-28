"use client"



import {useCartStore} from "../../../../store/use-cart-store";

export const CartResultInfo = () => {
    // Get the items directly instead of calling functions during render
    const items = useCartStore((state) => state.items)

    // Calculate totals from items
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)
    const totalItems = items.reduce((total, item) => total + item.quantity, 0)

    return (
        <div className="flex flex-col gap-4 bg-[#F5F7FF] rounded-[20px] p-6 h-fit">
            <h3 className="text-[20px] font-semibold text-[#161616]">Итого</h3>
            <div className="flex justify-between">
                <span className="text-[16px] text-[#858692]">Товары ({totalItems})</span>
                <span className="text-[16px] text-[#161616]">{totalPrice}₽</span>
            </div>
            <button className="rounded-full py-[10px] w-full text-[16px] text-white font-semibold bg-[#5069E8]">
                Оформить заказ
            </button>
        </div>
    )
}
