import { notFound } from "next/navigation"
import {getArticleById, getCategories} from "@/enteties/knowledge-base/knowledge-base";
import {KnowledgeBaseArticleEditor} from "@/features/knowledge-base/ui/knowledge-base-article-editor";


interface EditKnowledgeBaseArticlePageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: EditKnowledgeBaseArticlePageProps) {
    const { article } = await getArticleById(Number(params.id))

    if (!article) {
        return {
            title: "Статья не найдена",
            description: "Запрашиваемая статья не найдена",
        }
    }

    return {
        title: `Редактирование: ${article.title}`,
        description: `Редактирование статьи для базы знаний: ${article.title}`,
    }
}

export default async function EditKnowledgeBaseArticlePage({ params }: EditKnowledgeBaseArticlePageProps) {
    const { article } = await getArticleById(Number(params.id))
    const { categories = [] } = await getCategories()

    if (!article) {
        notFound()
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <h1 className="mds:text-[32px] text-[20px] text-black font-semibold mb-8">Редактирование статьи</h1>

            <KnowledgeBaseArticleEditor categories={categories} article={article} isEdit={true} />
        </div>
    )
}
