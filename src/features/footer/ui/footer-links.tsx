'use client'

import Link from "next/link"
import { useCatalog } from "@/features/header/catalog-context"
import { useState, useEffect } from "react"

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        setMatches(media.matches)

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
        media.addEventListener("change", listener)

        return () => media.removeEventListener("change", listener)
    }, [query])

    return matches
}

export const FooterLinks = () => {
    const { filteredCategories } = useCatalog()
    const isAbove800 = useMediaQuery("(min-width: 801px)")

    const baseData = [
        {
            title: "Навигация",
            links: [
                {
                    links: "/about-us",
                    text: "О магазине",
                },
                {
                    links: "/reviews",
                    text: "Отзывы",
                },
                {
                    links: "/articles",
                    text: "Статьи",
                },
                {
                    links: "/",
                    text: "Контакты",
                },
                {
                    links: "/answers",
                    text: "Ответы на вопросы",
                },
            ],
        },
        {
            title: "Каталог",
            links: filteredCategories.map((category) => ({
                links: "/catalog",
                text: category.title,
            })),
        },
        {
            title: "Соглашения",
            links: [
                {
                    links: "/privacy-policy",
                    text: "Политика конфиденциальности",
                },
                {
                    links: "/privacy-policy",
                    text: "Правила",
                },
            ],
        },
    ]

    // Reorder based on screen width
    const data = isAbove800
        ? baseData // "Навигация", "Каталог", "Соглашения" for > 800px
        : [baseData[1], baseData[0], baseData[2]] // "Каталог", "Навигация", "Соглашения" for <= 800px

    return (
        <div className="flex flex-wrap mds:justify-start justify-between lg:gap-16 mds:gap-8 sml:gap-20 sm:gap-10 s:gap-4 gap-8">
            {data.map((item) => (
                <div key={item.title} className="flex text-white flex-col z-[10] gap-4 text-[16px] leading-[20px]">
                    <h4 className="font-semibold">{item.title}</h4>
                    <ul className="flex flex-col font-medium gap-3 text-[14px] leading-[18px]">
                        {item.links.map((itemLink) => (
                            <Link key={itemLink.text} href={itemLink.links}>
                                <li className="sm:ml-[18px] ml-3 z-[3] list-disc">{itemLink.text}</li>
                            </Link>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}