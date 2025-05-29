import {TruckLogo} from "@/shared/icons";

export const PostBlock = () => {
    return (
        <div className="flex bg-[#F5F7FF] rounded-[20px] gap-2 mdbvp:p-6 p-4">
            <TruckLogo/>
            <p className="text-[12px] text-[#161616]">Мнговенная доставка на почту.</p>
        </div>
    )
}