"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export const LicenseInformationBlock = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="flex flex-col items-center gap-5 max-w-[700px] mx-auto">
            <h1 className="font-medium text-[40px] text-center leading-[55px] text-[#161616]">
                Интернет-магазин лицензионного программного обеспечения
            </h1>

            <div className=" relative">
                <div
                    className={`text-left text-[#6A6B75] text-[16px] w-[420px] transition-all duration-300 ${
                        !isExpanded ? "max-h-[120px] overflow-hidden mask-linear-gradient" : ""
                    }`}
                >
                    <p className="mb-4">
                        Лицензия открывает все возможности программы, будь то операционная система Windows, MS Office или антивирус.
                        Считаете, что активация слишком дорога? Интернет-магазин Keysoft предлагает лицензии и ключи активации по
                        низким ценам.Обеспечьте безопасность данных, паролей и средств, используя только лицензионные версии программ. Мы
                        сотрудничаем с Microsoft, Dr.Web, Kaspersky и другими, предлагая ключи на Windows, MS Office, Photoshop,
                        антивирусы и другие программы. Гарантия на весь товар. А также имеется реферальная система.
                    </p>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center self-start transition duration-200 gap-2 mx-auto mt-4 text-black font-medium"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={20} />
                            <span>Свернуть</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown size={20} />
                            <span>Читать полностью</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
