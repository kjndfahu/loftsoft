import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {CartBtns} from "@/features/cart/ui/cart-btns";
import {ItemType} from "@/features/cart/ui/item-type";
import {CartBlock} from "@/features/cart/ui/cart-block";
import {RecomendationList} from "@/features/product-page/ui/recomendation-list";
import {CartResultInfo} from "@/features/cart/container/cart-result-info";
import {CartItemsList} from "@/features/cart/ui/cart-items-list";

export default function CartPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title="Корзина"/>
            <CartBtns/>
            <div className="flex gap-[80px]">
                <CartItemsList/>
                <CartResultInfo/>
            </div>
            <RecomendationList/>
        </div>
    );
}
