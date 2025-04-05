import {Button} from "@/shared/button";
import {ChevronDown} from "@/shared/icons";

export const OrderBlock = () => {
    return (
        <div className="flex flex-col w-full p-6 rounded-[16px] border-[1px] border-[#DBDEEF]">
            <div className="flex pb-4 justify-between">
                <div className="flex flex-col gap-1 justify-between">
                    <span className="text-[13px] text-[#23A149]">• Заказ выполнен</span>
                    <span className="text-[20px] text-[#161616]">№72834238-004</span>
                </div>
                <Button logo={<ChevronDown/>} text="Раскрыть список"/>
            </div>

            <div className="flex pt-4 border-t-[1px] border-[#DBDEEF] justify-between">
                <p className="text-[14px] text-[#4E4F56]">Тип товара: <span className="text-[#161616]">Ключ, Аккаунт</span> </p>
                <p className="text-[14px] text-[#4E4F56]">Дата оформления: <span className="text-[#161616]">19 октября, 2022   /   10:22</span></p>
            </div>
        </div>
    )
}