"use client";

import { useCartStore } from "../../../../store/use-cart-store";
import { ConfirmationFrom } from "@/features/cart/ui/confirmation-from";
import { SbpLogo } from "@/shared/icons";
import { Mastercard, Mir, Sberbank, Visa } from "@/shared/bank-types-icons";

export const CartResultInfo = () => {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const originalTotalPrice = items.reduce((total, item) => total + (item.oldPrice || item.price) * item.quantity, 0);
    const discount = originalTotalPrice - totalPrice;
    const discountPercentage = originalTotalPrice > 0 ? Math.round((discount / originalTotalPrice) * 100) : 0;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 bg-[#F5F7FF] rounded-[20px] p-6 h-fit">
                <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-semibold text-[#161616]">Итого</h3>
                    <div className="flex justify-between">
            <span className="text-[36px] text-[#161616] font-semibold">
              {totalPrice}
                <span className="text-[18px] font-bold">₽</span>
            </span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-end justify-between">
                        <span className="text-[#6A6B75] font-medium text-[16px]">{totalItems} товара</span>
                        <span className="text-[#6A6B75] text-[16px] font-semibold">{originalTotalPrice.toLocaleString()}₽</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex items-center justify-between text-[#6A6B75] text-[16px] font-medium">
              <span className="flex items-center gap-2">
                Скидка
                <div className="flex text-[11px] text-[#E71730] bg-[#FEECEE] rounded-full px-1.5 py-1">
                  -{discountPercentage}%
                </div>
              </span>
                            <span>-{discount.toLocaleString()}₽</span>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationFrom items={items} clearCart={clearCart} />
            <div className="mds:flex hidden items-center w-full justify-center gap-4">
                <SbpLogo />
                <div className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#EFF2FF]">
                    <Visa />
                </div>
                <div className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#FAFAFA]">
                    <Mastercard />
                </div>
                <div className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#F1FFFB]">
                    <Mir />
                </div>
                <div className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#F1FFFB]">
                    <Sberbank />
                </div>
            </div>
        </div>
    );
};