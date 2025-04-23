import {useState} from "react";

export const CatalogBar = () => {
    const [tab, setTab] = useState("")

    return (
        <div className="flex flex-col w-[280px] border-r-[1px] border-r-[#c5cffd]">
            <div className="text-[14px] text-[#6A6B75] font-medium px-4 py-[11px]">Все товары</div>

            <div onClick={() => setTab("office")}
                 className={`${tab === "office" ? 'bg-[#F5F7FF] rounded-r-[8px] border-r-[4px] border-[#5069E8]' : 'bg-white'} cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}>Офисная
            </div>
            <div onClick={() => setTab("designing")}
                 className={`${tab === "designing" ? 'bg-[#F5F7FF] rounded-r-[8px] border-r-[4px] border-[#5069E8]' : 'bg-white'} cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}>Проектирование
            </div>
            <div onClick={() => setTab("dev")}
                 className={`${tab === "dev" ? 'bg-[#F5F7FF] rounded-r-[8px] border-r-[4px]  border-[#5069E8]' : 'bg-white'} cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}>Разработка
            </div>
            <div onClick={() => setTab("graph")}
                 className={`${tab === "graph" ? 'bg-[#F5F7FF] rounded-r-[8px] border-r-[4px] border-[#5069E8]' : 'bg-white'} cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}>Графика
            </div>
            <div onClick={() => setTab("microsoft")}
                 className={`${tab === "microsoft" ? 'bg-[#F5F7FF] rounded-r-[8px] border-r-[4px] border-[#5069E8]' : 'bg-white'} cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}>Майкрософт
            </div>
            <div onClick={() => setTab("security")}
                 className={`${tab === "security" ? 'bg-[#F5F7FF] rounded-r-[8px] border-r-[4px] border-[#5069E8]' : 'bg-white'} cursor-pointer text-[14px] text-[#161616] font-medium px-4 py-[11px]`}>Безопасность
            </div>
        </div>
    )
}