import {TitleDesc} from "@/shared/title-desc";
import {NavBtn} from "@/features/home/ui/nav-btn";
import {Items} from "@/features/home/ui/item";

export const PopularItems = () => {
    return (
        <div className="flex flex-col items-center px-[250px] gap-10">
            <TitleDesc title="Популярные товары" description="Выберите нужный товар"/>
            <div className="flex flex-wrap gap-4">
                <Items/>
                <Items/>
                <Items/>
                <Items/>
            </div>
            <NavBtn text="Подробнее"/>
        </div>
    )
}