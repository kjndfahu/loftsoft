import {TitleDesc} from "@/shared/title-desc";
import {NavBtn} from "@/features/home/ui/nav-btn";
import {ArticleBlock} from "@/features/home/ui/article-block";

export const ArticlesList = () => {
    return (
        <div className="flex flex-col items-center gap-10">
            <TitleDesc title="Статьи" description="Выберите нужную категорию"/>
            <div className="grid grid-cols-3 gap-6 w-full">
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
            </div>
            <NavBtn text="Все статьи"/>
        </div>
    )
}