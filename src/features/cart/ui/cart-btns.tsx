import {TrashLogo} from "@/shared/icons";

export const CartBtns = () => {
    return (
        <div className="flex w-full gap-6">
            <div className="flex items-center gap-[6px]">
                <input className="border-[2px] bg-[#CACDDC]" type="checkbox"/>
                <p className="text-[14px] text-[#161616]">Выбрать все</p>
            </div>
            <div className="flex gap-[6px]">
                <TrashLogo/>
                <p className="text-[14px] text-[#161616]">Удалить выбранное</p>
            </div>
        </div>
    )
}