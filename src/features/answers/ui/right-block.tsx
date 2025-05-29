import { FC } from "react";

interface Article {
    id: number;
    title: string;
    emoji: string;
    order: number;
    categoryId: number;
    content: string;
}

interface Props {
    articles: Article[];
    activeArticleId: number | null;
    setActiveArticleId: (id: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export const RightBlock: FC<Props> = ({ articles, activeArticleId, setActiveArticleId, containerRef }) => {
    const handleScroll = (id: string, articleId: number) => {
        console.log("handleScroll called for article:", articleId);
        setActiveArticleId(articleId);
        console.log("Set activeArticleId to:", articleId);

        setTimeout(() => {
            const element = document.getElementById(`title-${articleId}`);
            const container = containerRef.current;
            console.log("Element:", element, "Container:", container);

            if (element && container) {
                const offset = 500;
                const elementPosition = element.offsetTop;
                const offsetPosition = elementPosition - offset;

                container.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
                console.log("Scrolled to position:", offsetPosition);
            } else {
                console.error("Element or container not found:", { element, container });
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    console.log("Used scrollIntoView for element:", `title-${articleId}`);
                }
            }
        }, 100);
    };

    return (
        <div className="md:flex flex-col hidden w-1/4">
            <h4 className="font-semibold md:text-[16px] text-[14px] text-[#161616] mb-4">
                Оглавление
            </h4>
            <ul className="space-y-2 md:text-[14px] text-[12px] text-[#666666]">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <li key={article.id}>
                            <a
                                href={`#title-${article.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log("Clicked article:", article.id);
                                    handleScroll(`title-${article.id}`, article.id);
                                }}
                                className={`hover:text-[#333438] ${
                                    activeArticleId === article.id ? 'text-[#5069E8] font-semibold' : 'text-[#666666]'
                                }`}
                            >
                                {article.title}
                            </a>
                        </li>
                    ))
                ) : (
                    <li className="text-[#666666]">Нет статей в этой категории</li>
                )}
            </ul>
        </div>
    );
};