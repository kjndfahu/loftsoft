import {TitleDesc} from "@/shared/title-desc";
import {CategoryBlock} from "@/features/home/ui/category-block";
import {NavBtn} from "@/features/home/ui/nav-btn";

export const Categories = () => {
    return (
        <div className="flex flex-col items-center px-[250px] gap-10">
            <TitleDesc title="Категории товаров" description="Выберите нужную категорию"/>
            <div className="flex flex-wrap gap-4">
                <CategoryBlock/>
                <CategoryBlock/>
                <CategoryBlock/>
                <CategoryBlock/>
                <CategoryBlock/>
                <CategoryBlock/>
            </div>
            <NavBtn text="Все категории"/>
        </div>
     )
}