import {getCategories} from "@/enteties/knowledge-base/knowledge-base";
import {KnowledgeBaseArticleEditor} from "@/features/knowledge-base/ui/knowledge-base-article-editor";


export const metadata = {
    title: "Создание статьи для базы знаний",
    description: "Создание новой статьи для базы знаний",
}

export default async function CreateKnowledgeBaseArticlePage() {
    const { categories = [] } = await getCategories()

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <h1 className="mds:text-[32px] text-[20px] text-black font-semibold mb-8">Создание статьи для базы знаний</h1>

            {categories.length === 0 ? (
                <div className="bg-white border border-[#DBDEEF] rounded-lg p-6">
                    <p className="text-gray-500">Нет категорий. Создайте категорию, прежде чем добавлять статьи.</p>
                </div>
            ) : (
                <KnowledgeBaseArticleEditor categories={categories} />
            )}
        </div>
    )
}
