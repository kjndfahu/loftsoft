import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {ArticleBlock} from "@/features/home/ui/article-block";

export default function ArticlesPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title="Статьи"/>
            <div className="flex flex-wrap gap-6">
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
                <ArticleBlock/>
            </div>
        </div>
    );
}
