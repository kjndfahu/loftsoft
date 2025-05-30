import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, parseArticleContent } from "@/shared/utils";
import { Quote } from "@/features/articles/ui/quote";
import { getArticleById } from "@/enteties/articles/article";

interface ArticleDetailPageProps {
    params: { id: string };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
    const { success, article, error } = await getArticleById(Number(params.id));

    if (!success || !article) {
        console.error("Error fetching article:", error || "Article not found");
        notFound();
    }

    console.log("Article structure:", article ? article.title : "No article");

    const articleText =
        typeof article.text === "string" ? article.text : article.text ? JSON.stringify(article.text) : "";
    const articleContent = parseArticleContent(articleText);

    const formattedDate = article.updatedAt ? formatDate(article.updatedAt) : formatDate(article.createdAt);

    const relatedArticles = articleContent.filter((block) => block.type === "relatedArticle") as {
        type: "relatedArticle";
        content: { id: number; title: string; photo: string };
    }[];

    // Filter out related articles from the main content
    const mainContent = articleContent.filter((block) => block.type !== "relatedArticle");

    return (
        <div className="mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px]">
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-gray-700 transition-colors">
                    Главная
                </Link>
                <span className="mx-2">›</span>
                <Link href="/articles" className="hover:text-gray-700 transition-colors">
                    Новые коллекции ключей от Windows 2024
                </Link>
            </nav>

            <h1 className="sml:text-3xl text-[24px] md:text-4xl font-bold text-gray-900 mb-4">
                {article.title ? article.title : "Untitled Article"}
            </h1>

            <div className="flex items-center gap-4 mb-6">
                <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">Новинки</span>
                <span className="sml:text-sm text-[12px] text-gray-500">{formattedDate}</span>
            </div>

            {article.photo && typeof article.photo === "string" && (
                <div className="w-full mb-8">
                    <Image
                        src={article.photo || "/placeholder.svg"}
                        alt={article.title ? article.title : "Article image"}
                        width={1200}
                        height={600}
                        className="w-full h-auto rounded-lg object-cover"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700">
                {mainContent.length > 0 ? (
                    mainContent.map((block, index) => {
                        switch (block.type) {
                            case "section":
                                return (
                                    <section key={`section-${block.id}`} id={block.id} className="mb-8">
                                        <h2 className="mds:text-2xl text-[20px] sml:font-semibold font-medium text-gray-900 mb-4">
                                            {block.title}
                                        </h2>
                                        <p className="sml:text-base text-[14px] text-gray-700">{block.content}</p>
                                    </section>
                                );
                            case "text":
                                return (
                                    <p key={`text-${index}`} className="text-base mb-4">
                                        {block.content}
                                    </p>
                                );
                            case "quote":
                                return <Quote key={`quote-${index}`} text={block.content.text} author={block.content.author} />;
                            case "image":
                                return (
                                    <div key={`image-${index}`} className="my-6">
                                        <Image
                                            src={block.content || "/placeholder.svg"}
                                            alt={block.caption || "Article image"}
                                            width={1200}
                                            height={800}
                                            className="w-full h-auto rounded-lg object-contain"
                                        />
                                        {block.caption && (
                                            <p className="text-sm text-gray-500 mt-2 text-center italic">{block.caption}</p>
                                        )}
                                    </div>
                                );
                            case "link":
                                return (
                                    <p key={`link-${index}`} className="mb-4">
                                        <a
                                            href={block.content.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {block.content.title}
                                        </a>
                                    </p>
                                );
                            case "product":
                                return (
                                    <div
                                        key={`product-${index}`}
                                        className="mt-6 mb-4 border sml:rounded-[16px] rounded-[8px] sml:p-4 p-2 bg-[#F5F7FF]"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex sml:gap-4 gap-3 items-center">
                                                <div className="w-[43px] h-[58px] relative">
                                                    <Image
                                                        src={block.content?.photo || "/placeholder.svg"}
                                                        alt={block.content?.name || "Product image"}
                                                        width={43}
                                                        height={58}
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium sml:text-[18px] text-[15px] text-[#333438]">
                                                        {block.content?.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="justify-end cursor-pointer sml:w-[212px] w-[145px] block bg-[#5069E8] text-white px-4 sml:py-2 py-1 rounded-full sml:text-[16px] text-[14px] font-semibold text-center">
                                                Купить
                                            </div>
                                        </div>
                                    </div>
                                );
                            case "video":
                                return (
                                    <div key={`video-${index}`} className="my-6">
                                        <video
                                            controls
                                            src={block.content.url || "/placeholder.mp4"}
                                            className="w-full h-auto rounded-lg"
                                            poster="/placeholder.svg"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                        {block.content.caption && (
                                            <p className="text-sm text-gray-500 mt-2 text-center italic">
                                                {block.content.caption}
                                            </p>
                                        )}
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })
                ) : (
                    <p className="text-gray-500 italic">No content available.</p>
                )}
            </div>

            {/* Render related articles in a row */}
            {relatedArticles.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие статьи</h2>
                    <div className="flex mds:items-start mds:justify-start items-center justify-center flex-row flex-wrap gap-6 overflow-x-auto pb-4">
                        {relatedArticles.map((block, index) => (
                            <Link key={`relatedArticle-${index}`} href={`/articles/${block.content.id}`}>
                                <div className="flex flex-col gap-3 border-[1px] border-[#DBDEEF] w-[300px] flex-shrink-0 h-[384px] rounded-[14px] overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="w-full sml:h-[225px] h-[170px] bg-gray-200 rounded-[14px] relative overflow-hidden">
                                        <Image
                                            src={block.content.photo || "/placeholder.svg"}
                                            alt={block.content.title || "Related article image"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-5 px-[20px] pb-[23px]">
                                        <p className="text-[12px] font-medium text-[#A4A8BA]">
                                            {formatDate(new Date(block.content.createdAt || "2025-05-30"))}
                                        </p>
                                        <div className="flex flex-col gap-[10px] text-[16px] leading-[24px] text-[#161616]">
                                            <h3 className="font-semibold line-clamp-2">{block.content.title}</h3>
                                            <p className="text-[14px] leading-[21px] text-[#4E4F56] line-clamp-2">
                                                No content available {/* Placeholder; adjust if preview text is needed */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}