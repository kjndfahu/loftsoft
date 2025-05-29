export function formatDate(date: Date): string {
    if (!(date instanceof Date) && typeof date === "string") {
        date = new Date(date)
    }

    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date)
}

export const formatOrderType = (type: string): string => {
    switch (type) {
        case 'KEY':
            return 'Ключ';
        case 'SUBSCRIPTION':
            return 'Подписка';
        case 'ACCOUNT':
            return 'Аккаунт';
        default:
            return type;
    }
};

type ArticleContentBlock =
    | { type: "text"; content: string }
    | { type: "image"; content: string; caption?: string }
    | { type: "quote"; content: { text: string; author: string } }
    | { type: "section"; id: string; title: string; content: string }
    | { type: "link"; content: { url: string; title: string } }
    | { type: "product"; content: { id: string; name: string; price: number; photo: string } } // Add product type

export function parseArticleContent(text: string): ArticleContentBlock[] {
    if (!text) return []

    try {
        const content = JSON.parse(text)

        if (Array.isArray(content)) {
            return content.flatMap((block) => {
                if (!block || typeof block !== "object") {
                    return { type: "text", content: String(block || "") }
                }

                if (block.type === "quote") {
                    return {
                        type: "quote",
                        content: {
                            text: block.content?.text || "Цитата отсутствует",
                            author: block.content?.author || "",
                        },
                    }
                } else if (block.type === "section") {
                    return {
                        type: "section",
                        id: block.content?.id || `section-${Math.random().toString(36).substr(2, 9)}`,
                        title: block.content?.title || "Untitled",
                        content: block.content?.content || "",
                    }
                } else if (block.type === "image") {
                    return {
                        type: "image",
                        content: block.content?.url || "/placeholder.svg",
                        caption: block.content?.caption || "",
                    }
                } else if (block.type === "link") {
                    return {
                        type: "link",
                        content: {
                            url: block.content?.url || "#",
                            title: block.content?.title || "Link",
                        },
                    }
                } else if (block.type === "product") {
                    return {
                        type: "product",
                        content: {
                            id: block.content?.id || "",
                            name: block.content?.name || "Product",
                            price: block.content?.price || 0,
                            photo: block.content?.photo || "/placeholder.svg",
                        },
                    }
                } else if (block.type === "tableOfContents") {
                    const sections = block.content?.sections || []
                    return sections.map((section: { id: string; title: string; content: string }) => ({
                        type: "section",
                        id: section.id || `section-${Math.random().toString(36).substr(2, 9)}`,
                        title: section.title || "Untitled",
                        content: section.content || "",
                    }))
                }
                return {
                    type: "text",
                    content: block.content || "",
                }
            })
        }

        // If content is not an array, convert it to string
        return [{ type: "text", content: typeof content === "object" ? JSON.stringify(content) : String(content) }]
    } catch (e) {
        // If parsing fails, ensure we return a string
        return [{ type: "text", content: String(text) }]
    }
}
