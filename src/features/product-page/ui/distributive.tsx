"use client"

import { Download } from "lucide-react"
import Image from "next/image";

type DistributiveProps = {
    distributives: any[]
}

export const Distributive = ({ distributives }: DistributiveProps) => {
    if (distributives.length === 0) {
        return null
    }

    const handleDownload = (url: string, filename: string) => {
        // Create an anchor element and trigger download
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-[14px] text-[#161616]">Дистрибутивы</h4>
            <div className="flex flex-col gap-2">
                {distributives.map((distributive) => (
                    <div
                        key={distributive.id}
                        className="flex justify-between items-center rounded-[12px] cursor-pointer gap-2 p-[10px] border-[1px] border-[#E9EBF6] text-[13px] text-[#161616] hover:bg-[#F5F7FF] hover:text-[#5069E8]"
                        onClick={() => handleDownload(distributive.fileUrl, distributive.displayName)}
                    >
                        <div className="flex items-center text-[13px] text-[#333438] font-medium gap-[13px]">
                            <Image width={40} height={40} alt="/" src={distributive.logoUrl}/>
                            {distributive.displayName}
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-[16px] font-semibold underline">Скачать</p>
                            <Download className="h-4 w-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
