
import { notFound } from "next/navigation"

import {getArticleById} from "@/enteties/articles/article";
import {ArticleEditor} from "@/features/admin-articles/ui/article-editor-update";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const { article, success } = await getArticleById(Number.parseInt(params.id))

    if (!success || !article) {
        notFound()
    }

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <h1 className="mds:text-[32px] text-[20px] text-black font-semibold mb-8">Редактирование статьи</h1>
            <ArticleEditor article={article} />
        </div>
    )
}
