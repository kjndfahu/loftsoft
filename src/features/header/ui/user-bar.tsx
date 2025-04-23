import {MainLogo} from "@/shared/icons";
import {SearchBlock} from "@/features/header/ui/search-block";
import {ShopNavigation} from "@/features/header/ui/shop-navigation";
import Link from "next/link";

export const UserBar= () => {
    return (
        <div className="flex items-center justify-between bg-white pt-[20px] pb-[27px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px]">
            <Link href="/">
                <MainLogo/>
            </Link>
            <SearchBlock/>
            <ShopNavigation/>
        </div>
    )
}