"use client"

import { Download } from "lucide-react"

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
                        className="flex items-center gap-2 text-[13px] text-[#5069E8] border-[#DBDEEF] hover:bg-[#F5F7FF] hover:text-[#5069E8] justify-start"
                        onClick={() => handleDownload(distributive.fileUrl, distributive.displayName)}
                    >
                        <Download className="h-4 w-4" />
                        {distributive.displayName}
                    </div>
                ))}
            </div>
        </div>
    )
}
