
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { notFound } from "next/navigation"
import {getArticleById} from "@/enteties/articles/article";
import {ArticleViewer} from "@/features/admin-articles/ui/article-viewer";

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
    const { article, success } = await getArticleById(Number.parseInt(params.id))

    if (!success || !article) {
        notFound()
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <div className="flex items-center text-black gap-4 mb-8">
                <Link href="/admin-articles">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={16} />
                        Назад к списку
                    </button>
                </Link>
                <Link href={`/admin-articles/${params.id}/edit`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                        <Edit size={16} />
                        Редактировать
                    </button>
                </Link>
            </div>

            <ArticleViewer article={article} />
        </div>
    )
}
