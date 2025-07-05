"use client"

import { useEffect, useRef, useState } from "react"
import { SectionsBar } from "@/features/privacy-policy/ui/sections-bar"
import { Texts } from "@/features/privacy-policy/ui/texts"
import { BreadcrumbNav } from "@/shared/breadcrumb-nav"

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
    const contentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const contentArea = contentRef.current
        if (!contentArea) return

        // Убираем автоматическое определение активной секции по скроллу
        // Теперь активная секция устанавливается только при клике

        return () => {
            // Очистка не нужна, так как нет обработчиков событий
        }
    }, [])

    return (
        <div className="flex flex-col mds:pt-[150px] pt-20 xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Политика конфиденциальности" />
            <div className="flex" style={{ height: "calc(100vh - 150px)" }}>
                <SectionsBar
                    activeSection={activeSection}
                    sectionRefs={sectionRefs}
                    contentRef={contentRef}
                    setActiveSection={setActiveSection}
                />
                <div
                    ref={contentRef}
                    className="mds:w-2/3 mds:ml-[20%] hide-scrollbar overflow-y-auto pb-20"
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                >
                    <Texts sectionRefs={sectionRefs} />
                </div>
            </div>
        </div>
    )
}