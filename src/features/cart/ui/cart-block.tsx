import {CartPriceBlock} from "@/features/cart/ui/cart-price-block";
import {CartItemInfo} from "@/features/cart/ui/cart-item-info";
import {TrashLogo} from "@/shared/icons";

export const CartBlock = () => {
    return (
        <div className="flex items-start justify-between">
            <CartItemInfo/>
            <CartPriceBlock/>
            <TrashLogo className="cursor-pointer"/>
        </div>
    )
}