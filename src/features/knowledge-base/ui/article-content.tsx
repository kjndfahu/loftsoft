// features/knowledge-base/ui/article-content.tsx

"use client"

import Image from "next/image"

interface Article {
    id: number
    title: string
    content: string
    emoji?: string
}

interface Category {
    id: number
    name: string
    articles: Article[]
}

interface ArticleContentProps {
    category: Category
}

export const ArticleContent = ({ category }: ArticleContentProps) => {
    // Функция для парсинга и рендеринга контента одной статьи
    const renderContent = (content: string | any[], articleIndex: number) => {
        let parsedContent: any;

        // Если контент уже массив, используем его напрямую
        if (Array.isArray(content)) {
            parsedContent = content;
        } else {
            // Иначе пробуем парсить как JSON
            try {
                parsedContent = typeof content === "string" ? JSON.parse(content) : content;
            } catch (e) {
                parsedContent = content; // Если парсинг не удался, используем как есть
            }
        }

        if (!parsedContent) return null;

        // Если контент — массив блоков
        if (Array.isArray(parsedContent)) {
            return parsedContent.map((block: any, index: number) => {
                if (!block || !block.type) {
                    console.error("Invalid block structure:", block);
                    return null;
                }

                switch (block.type) {
                    case "text":
                        return (
                            <div
                                key={`${articleIndex}-${index}`}
                                className="text-[20px] text-[#161616] font-semibold mb-4"
                                dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                        );
                    case "image":
                        return (
                            <figure key={`${articleIndex}-${index}`} className="mb-6">
                                <Image
                                    src={block.content || "/placeholder.svg"}
                                    alt={block.caption || "Article image"}
                                    width={700}
                                    height={400}
                                    className="rounded-lg"
                                />
                                {block.caption && (
                                    <figcaption className="text-sm text-gray-500 mt-2">{block.caption}</figcaption>
                                )}
                            </figure>
                        );
                    case "list":
                        if (!block.content || !Array.isArray(block.content.items)) {
                            return null;
                        }
                        return (
                            <ol key={`${articleIndex}-${index}`} className="list-decimal pl-6 mb-4 space-y-2">
                                {block.content.items.map((item: string, i: number) => (
                                    <li key={`${articleIndex}-${i}`}>{item}</li>
                                ))}
                            </ol>
                        );
                    default:
                        return null;
                }
            });
        }

        // Если контент — просто строка
        return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
    };


    return (
        <div className="w-full">
            {/* Название категории */}
            <h2 className="text-[16px] font-semibold text-[#858692] mb-3">{category.name}</h2>

            {/* Список статей */}
            {category.articles.map((article, index) => (
                <div key={article.id} className="mb-12">

                    <h3 className="text-[24px] font-semibold border-b-[1px] border-b-[#DBDEEF] pb-6 mb-6 flex items-center">
                        {article.emoji && <span className="mr-2">{article.emoji}</span>}
                        {article.title}
                    </h3>
                    {/* Контент статьи */}
                    <div className="prose max-w-none">{renderContent(article.content, index)}</div>
                </div>
            ))}
        </div>
    )
}