import {BreadcrumbNav} from "@/shared/breadcrumb-nav";

import {Article} from "@/features/articles/ui/article";
import {BigArticle} from "@/features/articles/ui/big-article";

export default function ArticlesPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title="Статьи"/>
            <BigArticle/>
            <div className="grid grid-cols-4 gap-6 w-full">
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
            </div>
        </div>
    );
}
