import {StarLogo} from "@/shared/icons";

export const Items = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="w-[312px] h-[415px] bg-[#F5F7FF] rounded-[16px]"/>
            <div className="flex flex-col text-[#161616] gap-[10px]">
                <h3 className="text-[27px]">1400 ₽</h3>
                <div className="flex text-[16px] gap-1">
                    <div className="flex items-center gap-[6px] py-[4px] px-[6px] text-[#5069E8] bg-[#5F78EE26] rounded-[6px]">
                        <StarLogo color="#5069E8"/>
                        4.9
                    </div>
                    <div className="flex bg-[#ACB1C626] text-[#161616] py-[4px] px-[6px]">
                        499 купили
                    </div>
                </div>
                <p className="text-[20px]">Microsoft Excel 1 год</p>
            </div>
        </div>
    )
}