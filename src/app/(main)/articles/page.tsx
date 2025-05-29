import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { BigArticle } from "@/features/articles/ui/big-article"
import { Article } from "@/features/articles/ui/article"
import {getArticles} from "@/enteties/articles/article";


export default async function ArticlesPage() {
    const { success, articles = [] } = await getArticles()

    const featuredArticle = articles.length > 0 ? articles[0] : null
    const restOfArticles = articles.length > 1 ? articles.slice(1) : []

    return (
        <div className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] sml:gap-10 gap-6">
            <BreadcrumbNav title="Статьи" />

            {featuredArticle && <BigArticle article={featuredArticle} />}

            {restOfArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                    {restOfArticles.map((article) => (
                        <Article key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    )
}
