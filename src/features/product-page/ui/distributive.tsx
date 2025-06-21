// /src/components/distributive.tsx
"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { showToast } from "@/shared/custom-toast";

type DistributiveProps = {
    distributives: {
        id: number;
        displayName: string;
        fileUrl: string;
        logoUrl?: string;
    }[];
};

export const Distributive = ({ distributives }: DistributiveProps) => {
    // Log incoming props for debugging
    console.log("Distributives received:", distributives);

    // Early return if distributives is invalid
    if (!Array.isArray(distributives) || distributives.length === 0) {
        console.log("No valid distributives provided, rendering null");
        return null;
    }

    // Validate URL helper
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            console.error(`Invalid URL detected: ${url}`);
            return false;
        }
    };

    // Handle download with error handling
    const handleDownload = (url: string, filename: string) => {
        console.log("Initiating download:", { url, filename });

        if (!isValidUrl(url)) {
            showToast("Ошибка загрузки", "error", {
                secondaryMessage: "Недействительный URL файла.",
            });
            console.error(`Download failed: Invalid URL - ${url}`);
            return;
        }

        try {
            const link = document.createElement("a");
            link.href = url;
            link.download = filename || "downloaded_file";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`Download triggered for: ${url}`);
            showToast("Загрузка началась", "success", {
                secondaryMessage: `Скачивание ${filename}`,
            });
        } catch (error: any) {
            console.error("Download error:", error.message, error.stack);
            showToast("Ошибка загрузки", "error", {
                secondaryMessage: "Не удалось начать загрузку. Попробуйте снова.",
            });
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-[14px] text-[#161616]">Дистрибутивы</h4>
            <div className="flex flex-col gap-2">
                {distributives
                    .filter((distributive) => {
                        if (!distributive?.id || !distributive?.fileUrl || !distributive?.displayName) {
                            console.warn("Invalid distributive data:", distributive);
                            return false;
                        }
                        return true;
                    })
                    .map((distributive) => {
                        const logoSrc =
                            distributive.logoUrl && isValidUrl(distributive.logoUrl)
                                ? distributive.logoUrl
                                : "/placeholder.svg";

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
                                            console.error(`Failed to load logo: ${logoSrc}`);
                                            e.currentTarget.src = "/placeholder.svg";
                                        }}
                                    />
                                    {distributive.displayName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[16px] font-semibold underline">Скачать</p>
                                    <Download className="h-4 w-4" />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};