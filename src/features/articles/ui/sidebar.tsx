"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {fetchTableOfContents} from "@/enteties/gitbook-api";


type PageItem = {
    id: string
    title: string
    path: string
    children: PageItem[]
}

export function Sidebar() {
    const [pages, setPages] = useState<PageItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadTableOfContents() {
            try {
                setLoading(true)
                const data = await fetchTableOfContents()
                setPages(data)
                setError(null)
            } catch (err) {
                console.error("Ошибка при загрузке оглавления:", err)
                setError("Не удалось загрузить оглавление")
            } finally {
                setLoading(false)
            }
        }

        loadTableOfContents()
    }, [])

    // Рекурсивный компонент для отображения иерархии страниц
    const PageTree = ({ items }: { items: PageItem[] }) => (
        <ul className="space-y-1">
            {items.map((page) => (
                <li key={page.id}>
                    <Link href={`/articles/${page.id}`} className="text-blue-600 hover:underline block py-1">
                        {page.title}
                    </Link>
                    {page.children.length > 0 && (
                        <div className="pl-4 border-l border-gray-200">
                            <PageTree items={page.children} />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )

    return (
        <aside className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Оглавление</h2>

            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <PageTree items={pages} />
            )}
        </aside>
    )
}
