
type ArticleContentBlock =
    | { type: "text"; content: string }
    | { type: "image"; content: string; caption?: string }
    | { type: "quote"; content: { text: string; author: string } }
    | { type: "section"; id: string; title: string; content: string }
    | { type: "link"; content: { url: string; title: string } }
    | { type: "product"; content: { id: string; name: string; price: number; photo: string } }
    | { type: "video"; content: { url: string; caption?: string } }
    | { type: "relatedArticle"; content: { id: number; title: string; photo: string } };

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
}

export function parseArticleContent(text: string): ArticleContentBlock[] {
    if (!text) return [];

    try {
        const content = JSON.parse(text);

        if (Array.isArray(content)) {
            return content.flatMap((block) => {
                if (!block || typeof block !== "object") {
                    return { type: "text", content: String(block || "") };
                }

                switch (block.type) {
                    case "quote":
                        return {
                            type: "quote",
                            content: {
                                text: block.content?.text || "Цитата отсутствует",
                                author: block.content?.author || "",
                            },
                        };
                    case "section":
                        return {
                            type: "section",
                            id: block.id || `section-${Math.random().toString(36).substr(2, 9)}`,
                            title: block.content?.title || "Untitled",
                            content: block.content?.content || "",
                        };
                    case "image":
                        const imageUrl =
                            block.content && typeof block.content === "object" && block.content.url
                                ? block.content.url
                                : typeof block.content === "string"
                                    ? block.content
                                    : "/placeholder.svg";
                        return {
                            type: "image",
                            content: imageUrl,
                            caption:
                                block.content && typeof block.content === "object" ? block.content.caption || "" : "",
                        };
                    case "link":
                        return {
                            type: "link",
                            content: {
                                url: block.content?.url || "#",
                                title: block.content?.title || "Link",
                            },
                        };
                    case "product":
                        return {
                            type: "product",
                            content: {
                                id: block.content?.id || "",
                                name: block.content?.name || "Product",
                                price: block.content?.price || 0,
                                photo: block.content?.photo || "/placeholder.svg",
                            },
                        };
                    case "tableOfContents":
                        const sections = block.content?.sections || [];
                        return sections.map((section: { id: string; title: string; content: string }) => ({
                            type: "section",
                            id: section.id || `section-${Math.random().toString(36).substr(2, 9)}`,
                            title: section.title || "Untitled",
                            content: section.content || "",
                        }));
                    case "video":
                        return {
                            type: "video",
                            content: {
                                url: block.content?.url || "/placeholder.mp4",
                                caption: block.content?.caption || "",
                            },
                        };
                    case "relatedArticle":
                        return {
                            type: "relatedArticle",
                            content: {
                                id: block.content?.id || 0,
                                title: block.content?.title || "Related Article",
                                photo: block.content?.photo || "/placeholder.svg",
                            },
                        };
                    case "text":
                        return {
                            type: "text",
                            content: typeof block.content === "string" ? block.content : String(block.content || ""),
                        };
                    default:
                        return {
                            type: "text",
                            content: block.content ? String(block.content) : "",
                        };
                }
            });
        }

        return [{ type: "text", content: typeof content === "object" ? JSON.stringify(content) : String(content) }];
    } catch (e) {
        console.error("Error parsing article content:", e);
        return [{ type: "text", content: String(text) }];
    }
}
