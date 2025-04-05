import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {CategoryFilter} from "@/features/catalog/container/container-filters";
import {Items} from "@/features/home/ui/item";

export default function CatalogPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav/>
            <CategoryFilter/>
            <div className="flex flex-wrap gap-[19px]">
                <Items/>
                <Items/>
                <Items/>
                <Items/>
                <Items/>
                <Items/>
                <Items/>
                <Items/>
            </div>
        </div>
    );
}
