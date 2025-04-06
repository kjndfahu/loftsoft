import {TitleDesc} from "@/shared/title-desc";
import {NavBtn} from "@/features/home/ui/nav-btn";
import {Items} from "@/features/home/ui/item";

export const PopularItems = () => {
    return (
        <div className="flex flex-col items-center gap-10">
            <TitleDesc title="Популярные товары" description="Выберите нужный товар"/>
            <div className="grid grid-cols-4 gap-6 w-full">
                <Items/>
                <Items/>
                <Items/>
                <Items/>
            </div>
            <NavBtn text="Подробнее"/>
        </div>
    )
}