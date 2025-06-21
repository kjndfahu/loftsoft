// distributive.tsx
"use client"

import { Download } from "lucide-react"
import Image from "next/image"
import { showToast } from "@/shared/custom-toast"

type DistributiveProps = {
    distributives: {
        id: number
        displayName: string
        fileUrl: string
        logoUrl?: string
    }[]
}

export const Distributive = ({ distributives }: DistributiveProps) => {
    // Early return if no distributives are provided or invalid
    if (!distributives || !Array.isArray(distributives) || distributives.length === 0) {
        console.log("No valid distributives provided, rendering null")
        return null
    }

    // Validate URL helper function
    const isValidUrl = (url: string | undefined | null): boolean => {
        if (!url || typeof url !== "string") return false
        try {
            new URL(url)
            return true
        } catch {
            console.error(`Invalid URL detected: ${url}`)
            return false
        }
    }

    // Handle download with error handling and user feedback
    const handleDownload = (url: string, filename: string) => {
        if (typeof window === "undefined") {
            console.warn("Download attempted on server-side, aborting.")
            return
        }

        console.log("Initiating download:", { url, filename })

        if (!isValidUrl(url)) {
            showToast("Ошибка загрузки", "error", {
                secondaryMessage: "Invalid or inaccessible file URL.",
            })
            console.error(`Download failed: Invalid URL - ${url}`)
            return
        }

        try {
            const link = document.createElement("a")
            link.href = url
            link.download = filename || "downloaded_file"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            console.log(`Download triggered successfully for: ${url}`)
            showToast("Загрузка началась", "success", {
                secondaryMessage: `Downloading ${filename}`,
            })
        } catch (error) {
            console.error("Download error:", error)
            showToast("Ошибка загрузки", "error", {
                secondaryMessage: "Failed to initiate download. Please try again.",
            })
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-[14px] text-[#161616]">
                Дистрибутивы
            </h4>
            <div className="flex flex-col gap-2">
                {distributives.map((distributive) => {
                    // Проверка всех необходимых полей
                    if (
                        !distributive ||
                        typeof distributive !== "object" ||
                        !distributive.id ||
                        !distributive.fileUrl ||
                        !distributive.displayName
                    ) {
                        console.warn(`Invalid distributive data:`, distributive)
                        return null
                    }

                    // Fallback logo if logoUrl is invalid or missing
                    const logoSrc =
                        distributive.logoUrl &&
                        typeof distributive.logoUrl === "string" &&
                        isValidUrl(distributive.logoUrl)
                            ? distributive.logoUrl
                            : "/placeholder.svg"

                    return (
                        <div
                            key={distributive.id}
                            className="flex justify-between items-center rounded-[12px] cursor-pointer gap-2 p-[10px] border-[1px] border-[#E9EBF6] text-[13px] text-[#161616] hover:bg-[#F5F7FF] hover:text-[#5069E8]"
                            onClick={() => handleDownload(distributive.fileUrl, distributive.displayName)}
                        >
                            <div className="flex items-center text-[13px] text-[#333438] font-medium gap-[13px]">
                                <Image
                                    width={40}
                                    height={40}
                                    alt={distributive.displayName}
                                    src={logoSrc}
                                    onError={(e) => {
                                        console.error(`Failed to load logo: ${logoSrc}`)
                                        e.currentTarget.src = "/placeholder.svg"
                                    }}
                                />
                                {distributive.displayName}
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-[16px] font-semibold underline">Скачать</p>
                                <Download className="h-4 w-4" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}