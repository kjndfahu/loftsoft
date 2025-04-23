import {SearchBar} from "@/features/header/ui/search-bar";
import {CatalogBtn} from "@/features/header/ui/catalog-btn";
import {getCategories} from "@/enteties/category/category";

export const SearchBlock =async () => {
    const categories = await getCategories()
    console.log(categories)
    return (
        <div className="mds:flex hidden items-center md:gap-3 gap-1.5">
            <CatalogBtn/>
            <SearchBar categories={categories}/>
        </div>
    )
}