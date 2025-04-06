import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {ProductContainer} from "@/features/product-page/container/product-container";
import {RecomendationList} from "@/features/product-page/ui/recomendation-list";
import {Reviews} from "@/features/product-page/container/reviews";

export default function ItemPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title="Каталог"/>
            <ProductContainer/>
            <RecomendationList/>
            <Reviews/>
        </div>
    );
}
