"use client"

import type React from "react"

interface Props {
    sectionRefs: React.MutableRefObject<{ [key: string]: HTMLElement | null }>
    contentRef: React.MutableRefObject<HTMLDivElement | null>
    activeSection: string | null
    setActiveSection: (arg: string | null) => void
}

export const SectionsBar: React.FC<Props> = ({ sectionRefs, contentRef, setActiveSection, activeSection }) => {
    const sections = [
        { id: "01", title: "Основные правила" },
        { id: "02", title: "Определение терминов" },
        { id: "03", title: "Предмет соглашения" },
        { id: "04", title: "Порядок заказа и оплата" },
        { id: "05", title: "Возврат товара" },
        { id: "06", title: "Политика соглашения" },
        { id: "07", title: "Права и обязанности" },
        { id: "08", title: "Использование сайта" },
        { id: "09", title: "Ответственность" },
        { id: "10", title: "Нарушение условий" },
        { id: "11", title: "Конфиденциальность" },
        { id: "12", title: "Заключительные положения" },
    ]

    const scrollToSection = (id: string) => {
        const element = sectionRefs.current[id]
        const container = contentRef.current
        if (element && container) {
            const elementRect = element.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()
            const relativeTop = elementRect.top - containerRect.top + container.scrollTop
            
            // Скроллим контейнер так, чтобы элемент был в начале видимой области
            container.scrollTo({
                top: relativeTop,
                behavior: "smooth"
            })
            setActiveSection(id)
        }
    }

    return (
        <div className="mds:flex hidden flex-col items-start z-[1] bg-white sticky top-[150px] w-1/5 pr-6">
            <h2 className="text-[16px] text-[#161616] font-bold mb-4">Оглавление</h2>
            <ul className="space-y-2">
                {sections.map((section) => (
                    <li key={section.id}>
                        <button
                            onClick={() => scrollToSection(section.id)}
                            className={`block py-1 hover:text-[#5069E8] transition-colors text-left w-full ${
                                activeSection === section.id ? "text-[#5069E8] font-medium" : "text-[#6A6B75]"
                            }`}
                        >
                            {section.id}. {section.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}