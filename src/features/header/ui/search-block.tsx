import {SearchBar} from "@/features/header/ui/search-bar";
import {CatalogBtn} from "@/features/header/ui/catalog-btn";

export const SearchBlock = () => {
    return (
        <div className="flex items-center gap-3">
            <CatalogBtn/>
            <SearchBar/>
        </div>
    )
}