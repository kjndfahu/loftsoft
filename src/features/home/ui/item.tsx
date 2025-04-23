import {StarLogo} from "@/shared/icons";

export const Items = () => {
    return (
        <div className="flex flex-col w-full mds:gap-6 gap-[10px]">
            <div style={{aspectRatio: 312/415}} className="w-full bg-[#F5F7FF] rounded-[16px]"/>
            <div className="flex flex-col text-[#161616] sm:gap-[10px] gap-2">
                <h3 className="mds:text-[27px] sm:text-[20px] text-[16px] font-semibold">1400 ₽</h3>
                <div className="flex font-medium mds:text-[16px] sm:text-[14px] text-[12px] gap-1">
                    <div className="flex items-center gap-[6px] py-[4px] px-[6px] text-[#5069E8] bg-[#5F78EE26] rounded-[6px]">
                        <StarLogo color="#5069E8"/>
                        4.9
                    </div>
                    <div className="flex bg-[#ACB1C626] rounded-[6px] text-[#161616] py-[4px] px-[6px]">
                        499 купили
                    </div>
                </div>
                <p className="mds:text-[20px] sm:text-[17px] text-[14px] font-medium">Microsoft Excel 1 год</p>
            </div>
        </div>
    )
}