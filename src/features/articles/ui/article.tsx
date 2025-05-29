import Image from "next/image"
import Link from "next/link"
import { formatDate, parseArticleContent } from "@/shared/utils"

interface ArticleContentBlock {
    type: string
    content: string | { text?: string; author?: string; url?: string; title?: string; caption?: string }
    id?: string
    title?: string
    caption?: string
}

interface ArticleProps {
    article?: {
        id: number
        title: string
        text: string
        photo: string
        createdAt: Date
        updatedAt: Date
    }
}

export const Article = ({ article }: ArticleProps) => {
    if (!article) {
        return (
            <div className="flex flex-col gap-3 border-[1px] border-[#DBDEEF] w-full h-[384px] rounded-[14px] overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full h-[225px] bg-gray-200 rounded-[14px] relative overflow-hidden">
                    <Image src="/placeholder.svg" alt="Placeholder" fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-5 px-[20px] pb-[23px]">
                    <p className="text-[12px] font-medium text-[#A4A8BA]">-</p>
                    <div className="flex flex-col gap-[10px] text-[16px] leading-[24px] text-[#161616]">
                        <h3 className="font-semibold line-clamp-2">Загрузка...</h3>
                        <p className="text-[14px] leading-[21px] text-[#4E4F56] line-clamp-2">Загрузка...</p>
                    </div>
                </div>
            </div>
        )
    }

    const formattedDate = article.updatedAt ? formatDate(article.updatedAt) : formatDate(article.createdAt)

    const contentBlocks = parseArticleContent(article.text)
    const previewText = contentBlocks
        .map((block: ArticleContentBlock) => {
            if (block.type === "text") return block.content
            if (block.type === "quote") return (block.content as { text?: string }).text || ""
            if (block.type === "section") return block.content || block.title || ""
            if (block.type === "image") return block.caption || ""
            if (block.type === "link") return (block.content as { title?: string }).title || ""
            return ""
        })
        .filter((text) => text)
        .join(" ")
        .slice(0, 100)

    return (
        <Link href={`/articles/${article.id}`}>
            <div className="flex flex-col gap-3 border-[1px] border-[#DBDEEF] w-full h-[384px] rounded-[14px] overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full sml:h-[225px] h-[170px] bg-gray-200 rounded-[14px] relative overflow-hidden">
                    <Image src={article.photo || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-5 px-[20px] pb-[23px]">
                    <p className="text-[12px] font-medium text-[#A4A8BA]">{formattedDate}</p>
                    <div className="flex flex-col gap-[10px] text-[16px] leading-[24px] text-[#161616]">
                        <h3 className="font-semibold line-clamp-2">{article.title}</h3>
                        <p className="text-[14px] leading-[21px] text-[#4E4F56] line-clamp-2">
                            {previewText || "No content available"}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}