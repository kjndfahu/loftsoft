import {DownloadLogo} from "@/shared/icons";

export const DistributiveItem = () => {
    return (
        <div className="flex items-center justify-between p-[10px] border-[1px] border-[#E9EBF6] rounded-[10px]">
            <div className="flex items-center gap-3">
                <div className="bg-gray-400 w-[38px] h-[33px]"/>
                <h5 className="text-[13px] text-[#333438]">Office 2021 Professional Plus</h5>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[16px] text-[#161616]">Скачать</span>
                <DownloadLogo/>
            </div>
        </div>
    )
}