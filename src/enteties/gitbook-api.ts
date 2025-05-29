// This file provides functions to fetch data from the GitBook API.
// It's designed to be a simplified version based on the existing gitbook.ts

const GITBOOK_API_BASE_URL = "https://api.gitbook.com/v1"
const GITBOOK_SPACE_ID = "n0pQbWyxzS4ExLZvJUpS" // Hardcoded for now
const GITBOOK_API_KEY = "gb_api_BfixKipXwDnDUyuQAaTTh5uOR1Llh5empx6Qi6uZ" // Hardcoded for now

export interface GitBookArticle {
    id: string
    title: string
    description?: string
    content?: string
    createdAt?: string
    updatedAt?: string
    slug?: string
    coverImage?: string
    image?: string | null
    path?: string // Added path property to fix TypeScript error
}

// Базовая функция для запросов к GitBook API
async function gitbookFetch(endpoint: string) {
    const url = `${GITBOOK_API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITBOOK_API_KEY}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Кэширование на 1 час
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`GitBook API error (${response.status}): ${errorText}`)
    }

    return response.json()
}

export async function fetchPageById(pageId: string): Promise<GitBookArticle | null> {
    try {
        // First try to fetch by ID directly
        try {
            const data = await gitbookFetch(`/spaces/${GITBOOK_SPACE_ID}/content/page/${pageId}`)

            // Преобразование Markdown в HTML (в реальном проекте используйте библиотеку для парсинга Markdown)
            const htmlContent = convertMarkdownToHtml(data.content)

            return {
                id: data.id,
                title: data.title,
                description: data.description,
                content: htmlContent,
                updatedAt: new Date(data.updatedAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                image: data.coverImage?.url || null,
                createdAt: data.createdAt,
                slug: data.slug || data.id,
                path: data.path,
            }
        } catch (idError) {
            console.log(`Could not find page with ID ${pageId}, trying to find by path...`)

            // If direct ID fetch fails, try to find the page by path in all pages
            const allPages = await fetchAllPages()
            const pageByPath = allPages.find((page) => page.path === pageId || page.slug === pageId || page.id === pageId)

            if (!pageByPath) {
                console.error(`Could not find page with ID or path: ${pageId}`)
                return null
            }

            // Now fetch the full page data using the correct ID
            const data = await gitbookFetch(`/spaces/${GITBOOK_SPACE_ID}/content/page/${pageByPath.id}`)

            const htmlContent = convertMarkdownToHtml(data.content)

            return {
                id: data.id,
                title: data.title,
                description: data.description,
                content: htmlContent,
                updatedAt: new Date(data.updatedAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                image: data.coverImage?.url || null,
                createdAt: data.createdAt,
                slug: data.slug || data.id,
                path: data.path,
            }
        }
    } catch (error) {
        console.error(`Error fetching GitBook page with ID ${pageId}:`, error)
        return null
    }
}

export async function fetchAllPages(): Promise<GitBookArticle[]> {
    try {
        const data = await gitbookFetch(`/spaces/${GITBOOK_SPACE_ID}/content`)
        return data.pages.map((page: any) => ({
            id: page.id,
            title: page.title,
            path: page.path,
            description: page.description,
            updatedAt: new Date(page.updatedAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
            image: page.coverImage?.url || null,
        }))
    } catch (error) {
        console.error("Error fetching GitBook articles:", error)
        return []
    }
}

// Получение структуры оглавления
export async function fetchTableOfContents() {
    try {
        const data = await gitbookFetch(`/spaces/${GITBOOK_SPACE_ID}/content`)

        // Построение иерархии страниц
        return buildPageHierarchy(data.pages)
    } catch (error) {
        console.error("Error fetching table of contents:", error)
        return []
    }
}

// Вспомогательная функция для преобразования Markdown в HTML
// В реальном проекте используйте библиотеку типа remark или marked
function convertMarkdownToHtml(markdown: string): string {
    if (!markdown) return ""

    // Это упрощенная реализация, в реальном проекте используйте библиотеку для парсинга Markdown
    return markdown
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
        .replace(/\*(.*)\*/gm, "<em>$1</em>")
        .replace(/\n/gm, "<br>")
}

// Вспомогательная функция для построения иерархии страниц
function buildPageHierarchy(pages: any[]) {
    // Группировка страниц по родительским ID
    const pageMap = new Map()
    const rootPages: any[] = []

    // Сначала создаем карту всех страниц
    pages.forEach((page) => {
        pageMap.set(page.id, {
            ...page,
            children: [],
        })
    })

    // Затем строим иерархию
    pages.forEach((page) => {
        if (page.parentId) {
            const parent = pageMap.get(page.parentId)
            if (parent) {
                parent.children.push(pageMap.get(page.id))
            }
        } else {
            rootPages.push(pageMap.get(page.id))
        }
    })

    return rootPages
}
