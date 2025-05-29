import {ArticleEditor} from "@/features/admin-articles/ui/article-editor";


export default function CreateArticlePage() {
    return (
        <div className="flex flex-col mds:py-[150px] py-[90px] mds:pl-[350px] sml:pl-[100px] pl-[55px] mds:pr-[100px] sm:pr-[20px] w-full">
            <h1 className="mds:text-[32px] text-[20px] text-black font-semibold mb-8">Создание статьи</h1>
            <ArticleEditor />
        </div>
    )
}
