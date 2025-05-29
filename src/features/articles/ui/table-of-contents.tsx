"use client"

import { useEffect, useState } from "react"

interface TableOfContentsProps {
    headings: {
        id: string
        text: string
        level: number
    }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        if (headings.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-100px 0px -80% 0px" },
        )

        headings.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            headings.forEach(({ id }) => {
                const element = document.getElementById(id)
                if (element) {
                    observer.unobserve(element)
                }
            })
        }
    }, [headings])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
            setActiveId(id)
        }
    }

    if (headings.length === 0) {
        return null
    }

    console.log("TableOfContents rendering with headings:", headings)

    return (
        <div className="rounded-lg border border-[#DBDEEF] p-4 bg-white text-black">
            <h3 className="text-lg font-semibold mb-4 text-black">Оглавление</h3>
            <nav className="toc">
                <ul className="space-y-2 text-sm">
                    {headings.map((heading) => (
                        <li key={heading.id} className={`${heading.level > 1 ? `ml-${(heading.level - 1) * 3}` : ""}`}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    scrollToSection(heading.id)
                                }}
                                className={`block hover:text-blue-500 transition-colors ${
                                    activeId === heading.id ? "text-blue-500 font-medium" : "text-gray-700"
                                }`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
