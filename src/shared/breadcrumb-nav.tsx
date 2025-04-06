import {ArrowRight} from "@/shared/icons";

interface Props{
    title: string;
}

export const BreadcrumbNav:React.FC<Props> = ({title}) => {
    return (
        <div className="flex flex-col ">
            <nav className="flex items-center text-[12px] text-[#A4A8BA] gap-1">
                <p>Главная</p>
                <ArrowRight/>
                <p>Каталог</p>
            </nav>
            <h1 className="text-[#161616] leading-[42px] font-medium text-[34px]">{title}</h1>
        </div>
    )
}