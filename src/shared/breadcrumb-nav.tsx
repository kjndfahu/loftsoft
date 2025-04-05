import {ArrowRight} from "@/shared/icons";

export const BreadcrumbNav = () => {
    return (
        <div className="flex flex-col ">
            <nav className="flex items-center text-[12px] text-[#A4A8BA] gap-1">
                <p>Главная</p>
                <ArrowRight/>
                <p>Каталог</p>
            </nav>
            <h1 className="text-[#161616] leading-[42px] font-medium text-[34px]">Каталог</h1>
        </div>
    )
}