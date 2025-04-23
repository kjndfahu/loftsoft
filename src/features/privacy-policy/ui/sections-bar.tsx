interface Props{
    sectionRefs:any;
    activeSection: string | null;
    setActiveSection: (arg: string | null) => void;
}

export const SectionsBar:React.FC<Props> = ({sectionRefs, setActiveSection, activeSection}) => {
    const sections = [
        { id: "01", title: "Основные правила" },
        { id: "02", title: "Определение терминов" },
        { id: "03", title: "Предмет соглашения" },
        { id: "04", title: "Порядок заказа и оплата" },
        { id: "05", title: "Возврат товара" },
        { id: "06", title: "Политика соглашения" },
        { id: "07", title: "Права и обязанности" },
        { id: "08", title: "Использование сайта" },
        { id: "09", title: "Ответственность" },
        { id: "10", title: "Нарушение условий" },
        { id: "11", title: "Конфиденциальность" },
        { id: "12", title: "Заключительные положения" },
    ]

    const scrollToSection = (id: string) => {
        const element = sectionRefs.current[id]
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            setActiveSection(id)
        }
    }

    return (
        <div className="w-1/3 pt-[150px] border-r border-gray-200 fixed top-[100px] left-[250px] h-screen">
            <h2 className="text-xl font-bold mb-4">Оглавление</h2>
            <ul className="space-y-2">
                {sections.map((section) => (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToSection(section.id)
                            }}
                            className={`block py-1 hover:text-purple-600 transition-colors ${
                                activeSection === section.id ? "text-purple-600 font-medium" : "text-gray-700"
                            }`}
                        >
                            {section.id}. {section.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}