import { FC, useRef } from "react";

interface ContentItem {
    id: string;
    type: string;
    content: string | { items: string[] };
}

interface Article {
    id: number;
    title: string;
    emoji: string;
    order: number;
    content: string;
}

interface Props {
    categoryName: string;
    categoryEmoji: string;
    articles: Article[];
    containerRef: React.RefObject<HTMLDivElement>;
}

export const AnswersArticle: FC<Props> = ({ categoryName, categoryEmoji, articles, containerRef }) => {
    const renderContent = (content: string) => {
        try {
            const parsedContent: ContentItem[] = JSON.parse(content);
            return parsedContent.map((item) => {
                switch (item.type) {
                    case "text":
                        // Split content by new lines and render each line with HTML
                        const lines = (typeof item.content === "string" ? item.content : "")
                            .split("\n")
                            .filter(line => line.trim() !== ""); // Remove empty lines
                        return lines.map((line, index) => (
                            <p
                                key={`${item.id}-${index}`}
                                className="md:text-[14px] text-[12px] text-[#666666] ml-4"
                                dangerouslySetInnerHTML={{ __html: line }}
                            />
                        ));
                    case "image":
                        return (
                            <img
                                key={item.id}
                                src={typeof item.content === "string" ? item.content : ""}
                                alt="Article image"
                                className="md:max-w-[80%] max-w-[90%] mx-auto my-4 rounded-lg"
                            />
                        );
                    case "video":
                        return (
                            <video
                                key={item.id}
                                controls
                                className="md:max-w-[80%] max-w-[90%] mx-auto my-4 rounded-lg"
                            >
                                <source src={typeof item.content === "string" ? item.content : ""} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        );
                    case "list":
                        try {
                            const listItems =
                                typeof item.content === "string"
                                    ? JSON.parse(item.content)
                                    : item.content;
                            const items = listItems.items || [];
                            return (
                                <ul
                                    key={item.id}
                                    className="md:text-[14px] text-[12px] text-[#666666] ml-8 list-disc"
                                >
                                    {items.map((listItem: string, index: number) => (
                                        <li key={`${item.id}-${index}`} dangerouslySetInnerHTML={{ __html: listItem }} />
                                    ))}
                                </ul>
                            );
                        } catch (error) {
                            console.error("Error parsing list content:", error);
                            return (
                                <p className="md:text-[14px] text-[12px] text-[#666666] ml-4">
                                    Не удалось загрузить список.
                                </p>
                            );
                        }
                    default:
                        return null;
                }
            });
        } catch (error) {
            console.error("Error parsing content:", error);
            return (
                <p className="md:text-[14px] text-[12px] text-[#666666] ml-4">
                    Не удалось загрузить содержимое статьи.
                </p>
            );
        }
    };

    return (
        <>
            <h4 className="flex items-center gap-4 w-full border-b-[1px] border-[#DBDEEF] pb-6 font-semibold md:text-[24px] text-[18px] text-[#161616] mb-4">
                <span className="w-[29px] h-[37px] flex items-center justify-center">{categoryEmoji}</span>
                {categoryName}
            </h4>
            <div
                ref={containerRef}
                className="space-y-4 overflow-y-auto h-[648px] pr-4"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div
                            key={article.id}
                            id={`article-${article.id}`}
                            style={{ scrollMarginTop: "80px" }}
                        >
                            <h5
                                id={`title-${article.id}`}
                                className="font-semibold mb-5 md:text-[20px] text-[16px] text-[#161616]"
                                style={{ scrollMarginTop: "80px" }}
                            >
                                {article.emoji} {article.title}
                            </h5>
                            {renderContent(article.content)}
                        </div>
                    ))
                ) : (
                    <p className="md:text-[14px] text-[12px] text-[#666666]">
                        Нет статей для этой категории.
                    </p>
                )}
            </div>
        </>
    );
};