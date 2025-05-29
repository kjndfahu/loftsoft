import Link from "next/link"
import Image from "next/image"
import {formatDate} from "@/shared/utils";


interface BigArticleProps {
    article?: {
        id: number
        title: string
        photo: string
        createdAt: Date
        updatedAt: Date
    }
}

export const BigArticle = ({ article }: BigArticleProps) => {
    if (!article) {
        return (
            <div className="flex flex-col gap-3 border-[1px] border-[#DBDEEF] w-full h-[488px] rounded-[14px] overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full h-[375px] bg-gray-200 rounded-[14px] relative overflow-hidden">
                    <Image src="/placeholder.svg" alt="Placeholder" fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-5 px-[20px] pt-[20px] pb-[32px]">
                    <p className="text-[12px] font-medium text-[#A4A8BA]">-</p>
                    <div className="flex flex-col gap-[10px] sml:text-[22px] sm:text-[19px] text-[16px] sml:leading-[30px] sm:leading-6 leading-4 text-[#161616]">
                        <h3 className="font-semibold line-clamp-2">Загрузка...</h3>
                    </div>
                </div>
            </div>
        )
    }

    const formattedDate = article.updatedAt ? formatDate(article.updatedAt) : formatDate(article.createdAt)

    return (
        <Link href={`/articles/${article.id}`} className="block">
            <div className="flex flex-col gap-3 border-[1px] border-[#DBDEEF] w-full sml:h-[488px] h-[384px] rounded-[14px] overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full sml:h-[375px] h-[250px] bg-gray-200 rounded-[14px] relative overflow-hidden">
                    <Image src={article.photo || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-5 px-[20px] pt-[20px] pb-[32px]">
                    <p className="text-[12px] font-medium text-[#A4A8BA]">{formattedDate}</p>
                    <div className="flex flex-col gap-[10px] sml:text-[22px] sm:text-[19px] text-[16px] sml:leading-[30px] sm:leading-6 leading-4 text-[#161616]">
                        <h3 className="font-semibold line-clamp-2">{article.title}</h3>
                    </div>
                </div>
            </div>
        </Link>
    )
}
