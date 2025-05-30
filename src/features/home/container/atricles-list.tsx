import { TitleDesc } from "@/shared/title-desc"
import { NavBtn } from "@/features/home/ui/nav-btn"
import { ArticleBlock } from "@/features/home/ui/article-block"
import {getBestArticles} from "@/enteties/articles/article";
import Link from "next/link";


export const ArticlesList = async () => {
    const { success, articles = [] } = await getBestArticles()

    const latestArticles = articles.slice(0, 3)

    return (
        <div className="flex flex-col items-center mds:gap-10 gap-6">
            <TitleDesc title="Статьи" description="Выберите нужную категорию" />
            <div className="grid mds:grid-cols-3 grid-cols-1 md:gap-6 mds:gap-2 gap-5 w-full">
                {latestArticles.length > 0 ? (
                    latestArticles.map((article) => (
                        <ArticleBlock
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            text={article.text || ""}
                            photo={article.photo}
                            createdAt={article.createdAt}
                        />
                    ))
                ) : (
                    <p className="col-span-3 text-center text-gray-500">Статьи не найдены</p>
                )}
            </div>
           <Link className="flex items-center justify-center w-full" href="/articles">
               <NavBtn text="Все статьи" />
           </Link>
        </div>
    )
}
