import {ArrowRight} from "@/shared/icons";

interface Props{
    title?: string;
}

export const BreadcrumbNav:React.FC<Props> = ({title}) => {
    return (
        <div className="flex flex-col z-[3]">
            <nav className="flex items-center text-[12px] text-[#A4A8BA] gap-1">
                <p>Главная</p>
                <ArrowRight/>
                <p>Каталог</p>
            </nav>
            <h1 className="text-[#161616] sml:leading-[42px] leading-[28px] font-medium sml:text-[34px] text-[24px]">{title}</h1>
        </div>
    )
}