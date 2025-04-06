import {MainLogo} from "@/shared/icons";
import {SearchBlock} from "@/features/header/ui/search-block";
import {ShopNavigation} from "@/features/header/ui/shop-navigation";
import Link from "next/link";

export const UserBar= () => {
    return (
        <div className="flex items-center justify-between bg-white pt-[20px] pb-[27px] px-[250px]">
            <Link href="/">
                <MainLogo/>
            </Link>
            <SearchBlock/>
            <ShopNavigation/>
        </div>
    )
}