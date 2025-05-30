import {formatDate} from "@/shared/utils";
import Link from "next/link";


interface ArticleBlockProps {
    id: number
    title: string
    text: string
    photo: string
    createdAt: Date
}

function getArticleExcerpt(content: string, maxLength = 120): string {
    const cleanText = content.replace(/<\/?[^>]+(>|$)/g, "")

    if (cleanText.length <= maxLength) return cleanText

    const lastSpace = cleanText.substring(0, maxLength).lastIndexOf(" ")
    const excerpt = cleanText.substring(0, lastSpace > 0 ? lastSpace : maxLength)

    return `${excerpt}...`
}

export const ArticleBlock = ({ id, title, text, photo, createdAt }: ArticleBlockProps) => {
    const formattedDate = formatDate(createdAt)

    return (
        <Link href={`/articles/${id}`}>
            <div
                style={{aspectRatio: 424 / 410}}
                className="flex flex-col gap-4 border-[1px] border-[#DBDEEF] w-full rounded-[14px]"
            >
                <div
                    style={{
                        aspectRatio: 424 / 283,
                        backgroundImage: `url(${photo || "/placeholder-article.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="w-full rounded-[14px]"
                />
                <div className="flex flex-col md:gap-5 gap-[18px] px-[20px] pb-5">
                    <p className="text-[12px] font-medium text-[#A4A8BA]">{formattedDate}</p>
                    <div
                        className="flex flex-col gap-[10px] md:text-[20px] text-[16px] md:leading-[26px] leading-[20px] text-[#161616]">
                        <h3 className="font-semibold">{title}</h3>
                        {/*<p className="md:text-[16px] text-[14px] leading-[23px] text-[#4E4F56] line-clamp-2">*/}
                        {/*    {getArticleExcerpt(text, 120)}*/}
                        {/*</p>*/}
                    </div>
                </div>
            </div>
        </Link>
    )
}
