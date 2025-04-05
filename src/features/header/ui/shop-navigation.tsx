import {BoxLogo, CartLogo, UserLogo} from "@/shared/icons";
import Link from "next/link";

export const ShopNavigation = () => {
    return (
        <div className="flex items-center gap-5 text-[12px] text-[#858692]">
            <Link href="/profile">
                <div className="flex items-center cursor-pointer flex-col gap-1">
                    <UserLogo/>
                    Войти
                </div>
            </Link>
            <div className="flex items-center cursor-pointer flex-col gap-1">
                <BoxLogo/>
                Заказы
            </div>
            <div className="flex items-center cursor-pointer flex-col gap-1">
                <CartLogo/>
                Корзина
            </div>
        </div>
    )
}