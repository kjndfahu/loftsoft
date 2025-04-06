import { TitleDesc } from "@/shared/title-desc"
import { CategoryBlock } from "@/features/home/ui/category-block"
import { NavBtn } from "@/features/home/ui/nav-btn"
import {DesigningImg, ElaborationImg, GraphImg, MicrosoftImg, OfficeImg, SecurityImg} from "@/shared/catalog-images";

export const Categories = () => {
    return (
        <div className="flex flex-col items-center gap-10">
            <TitleDesc title="Категории товаров" description="Выберите нужную категорию" />
            <div className="grid grid-cols-3 gap-6 w-full">
                <CategoryBlock logo={ <DesigningImg className="absolute bottom-0" /> }/>
                <CategoryBlock logo={ <ElaborationImg className="absolute bottom-0" /> }/>
                <CategoryBlock logo={ <GraphImg className="absolute bottom-0" /> }/>
                <CategoryBlock logo={ <MicrosoftImg className="absolute bottom-0" /> }/>
                <CategoryBlock logo={ <OfficeImg className="absolute bottom-0" /> }/>
                <CategoryBlock logo={ <SecurityImg className="absolute bottom-0" /> }/>
            </div>
            <NavBtn text="Все категории" />
        </div>
    )
}

