export const FooterLinks = () => {
    const data = [
        {
            title: "Навигация",
            links: ["О магазине", "Отзывы", "Статьи", "Контакты", "Ответы на вопросы"],
        },
        {
            title: "Каталог",
            links: ["Microsoft Office", "Microsoft Windows", "Антивирусы", "Autodesk", "Офисные приложения", "Подписки"],
        },
        {
            title: "Соглашения",
            links: ["Политика конфиденциальности", "Правила"],
        },
    ]

    return (
        <div className="flex gap-16">
            {data.map((item) => {
                return (
                    <div key={item.title} className="flex flex-col gap-4 text-[16px] leading-[20px]">
                        <h4 className="font-semibold">{item.title}</h4>
                        <ul className="flex flex-col font-medium gap-3 text-[14px] leading-[18px]">
                            {item.links.map((itemLink) => (
                                <li className="ml-[18px] list-disc" key={itemLink}>{itemLink}</li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

