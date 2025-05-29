import { BreadcrumbNav } from "@/shared/breadcrumb-nav";
import { getArticles, getCategories } from "@/enteties/knowledge-base/knowledge-base";
import { AnswersWrapper } from "@/features/answers/container/answers-wrapper";


export default async function AnswersPage() {
    const { categories = [] } = await getCategories();
    const { articles = [] } = await getArticles();
    return (
        <div
            className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav title="Ответы на вопросы" />
            {/*<AnswersWrapper categories={categories} articles={articles} />*/}
        </div>
    );
}