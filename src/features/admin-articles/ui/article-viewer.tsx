"use client"

import Image from "next/image"
import Link from "next/link"

interface ArticleViewerProps {
    article: any
}

export const ArticleViewer = ({ article }: ArticleViewerProps) => {
    // Parse the content from JSON string
    let content = []
    try {
        content = JSON.parse(article.text || "[]")
    } catch (e) {
        // If the content is not valid JSON, treat it as a single text block
        content = [{ id: "1", type: "text", content: article.text || "" }]
    }

    // Render a content block based on its type
    const renderContentBlock = (block: any) => {
        switch (block.type) {
            case "text":
                return (
                    <div className="max-w-none">
                        {block.content.split("\n").map((paragraph: string, i: number) => (
                            <p key={i} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                )

            case "image":
                return (
                    <figure className="my-8">
                        <div className="relative w-full h-[400px]">
                            <Image
                                src={
                                    typeof block.content === "string" ? block.content : block.content?.previewUrl || "/placeholder.svg"
                                }
                                alt={block.content?.caption || "Article image"}
                                fill
                                className="object-contain"
                            />
                        </div>
                        {block.content?.caption && (
                            <figcaption className="text-center text-sm text-gray-500 mt-2">{block.content.caption}</figcaption>
                        )}
                    </figure>
                )

            case "video":
                return (
                    <figure className="my-8">
                        <video
                            src={typeof block.content === "string" ? block.content : block.content?.previewUrl}
                            controls
                            className="w-full rounded-lg"
                        />
                        {block.content?.caption && (
                            <figcaption className="text-center text-sm text-gray-500 mt-2">{block.content.caption}</figcaption>
                        )}
                    </figure>
                )

            case "quote":
                return (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-6 italic">
                        <p className="text-lg">{block.content?.text}</p>
                        {block.content?.author && <footer className="text-right text-sm mt-2">— {block.content.author}</footer>}
                    </blockquote>
                )

            case "link":
                return (
                    <div className="my-6 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <a
                            href={block.content?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col no-underline"
                        >
                            <h3 className="text-lg font-medium text-blue-600">{block.content?.title || block.content?.url}</h3>
                            {block.content?.description && <p className="text-gray-600 mt-1">{block.content.description}</p>}
                            <span className="text-sm text-gray-400 mt-2">{block.content?.url}</span>
                        </a>
                    </div>
                )

            case "product":
                return (
                    <div className="my-6 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <Link href={`/catalog/${block.content?.id}`} className="flex items-center gap-4 no-underline">
                            {block.content?.photo && (
                                <div className="relative h-24 w-24 flex-shrink-0">
                                    <Image
                                        src={block.content.photo || "/placeholder.svg"}
                                        alt={block.content.name}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-medium">{block.content?.name}</h3>
                                <p className="text-gray-600">{block.content?.price}</p>
                                <span className="text-sm text-blue-600 mt-2">Перейти к товару →</span>
                            </div>
                        </Link>
                    </div>
                )

            case "relatedArticle":
                return (
                    <div className="my-6 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <Link href={`/articles/${block.content?.id}`} className="flex items-center gap-4 no-underline">
                            {block.content?.photo && (
                                <div className="relative h-24 w-24 flex-shrink-0">
                                    <Image
                                        src={block.content.photo || "/placeholder.svg"}
                                        alt={block.content.title}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-medium">{block.content?.title}</h3>
                                <span className="text-sm text-blue-600 mt-2">Читать статью →</span>
                            </div>
                        </Link>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <article className="w-full text-black">
            <header className="mb-8 text-black">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <div className="text-gray-500 text-sm">{""}</div>
            </header>

            {article.photo && (
                <div className="relative w-full h-[400px] mb-8">
                    <Image
                        src={article.photo || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            )}

            <div className="space-y-6">
                {content.map((block: any) => (
                    <div key={block.id}>{renderContentBlock(block)}</div>
                ))}
            </div>
        </article>
    )
}
