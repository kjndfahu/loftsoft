import { MainLogo } from "@/shared/icons";
import { SearchBlock } from "@/features/header/ui/search-block";
import { ShopNavigation } from "@/features/header/ui/shop-navigation";
import Link from "next/link";
import {useSearch} from "@/features/header/search-context";


export const UserBar = () => {
    const { isSearchOpen } = useSearch();

    return (
        <div className={`flex items-center gap-3 justify-between bg-white ${isSearchOpen ? 'pt-[18px] pb-[20px]' : 'pt-[20px] pb-[27px]'}  xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px]`}>
            {!isSearchOpen && (
                <Link className="" href="/">
                    <MainLogo />
                </Link>
            )}
            <SearchBlock />
            <ShopNavigation />
        </div>
    );
};