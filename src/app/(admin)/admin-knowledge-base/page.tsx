import Link from "next/link"
import {getCategories} from "@/enteties/knowledge-base/knowledge-base";
import {CategoryEditor} from "@/features/knowledge-base/ui/category-editor";


export const metadata = {
    title: "Управление базой знаний",
    description: "Административная панель для управления базой знаний",
}

export default async function AdminKnowledgeBasePage() {
    const { categories = [] } = await getCategories()

    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="mds:text-[32px] text-[20px] text-black font-semibold">Управление базой знаний</h1>
                <Link
                    href="/admin-knowledge-base/create-article"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Создать статью
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 text-[#161616] gap-8">
                <div className="bg-white border border-[#DBDEEF] rounded-lg p-6">
                    <CategoryEditor categories={categories} />
                </div>

                <div className="bg-white border border-[#DBDEEF] rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">Статьи по категориям</h2>

                    {categories.length === 0 ? (
                        <p className="text-gray-500">Нет категорий. Создайте категорию, чтобы добавить статьи.</p>
                    ) : (
                        <div className="space-y-6">
                            {categories.map((category) => (
                                <div key={category.id} className="space-y-3">
                                    <h3 className="text-lg font-medium flex items-center">
                                        <span className="mr-2">{category.emoji}</span>
                                        {category.name}
                                    </h3>

                                    {category.articles.length === 0 ? (
                                        <p className="text-gray-500 text-sm pl-6">Нет статей в этой категории</p>
                                    ) : (
                                        <ul className="space-y-2 sml:pl-6">
                                            {category.articles.map((article) => (
                                                <li key={article.id} className="flex sml:gap-0 gap-2 sml:flex-row flex-col sml:items-center justify-between">
                                                    <div className="flex items-center">
                                                        {article.emoji && <span className="mr-2">{article.emoji}</span>}
                                                        <span>{article.title}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/admin-knowledge-base/edit-article/${article.id}`}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            Редактировать
                                                        </Link>
                                                        <Link
                                                            href={`/knowledge-base/${article.id}`}
                                                            className="text-sm text-gray-600 hover:text-gray-800"
                                                            target="_blank"
                                                        >
                                                            Просмотр
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
