import { SearchBar } from "@/features/header/ui/search-bar"
import { CatalogBtn } from "@/features/header/ui/catalog-btn"


export const SearchBlock = () => {
    return (

            <div className="mds:flex hidden items-center md:gap-3 gap-1.5">
                <CatalogBtn />
                <SearchBar categories={[]} />
            </div>

    )
}