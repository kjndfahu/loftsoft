"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FaqItem = {
    id: number
    question: string
    answer: string
}

const faqData: FaqItem[] = [
    {
        id: 1,
        question: "Где посмотреть наличие товара?",
        answer: "Вы можете проверить наличие товара на странице товара или связаться с нашей службой поддержки клиентов.",
    },
    {
        id: 2,
        question: "Где посмотреть наличие товара?",
        answer:
            "Информация о наличии товара отображается на странице товара. Если товар есть в наличии, вы увидите соответствующую отметку.",
    },
    {
        id: 3,
        question: "Где посмотреть наличие товара?",
        answer:
            'Наличие товара можно проверить в разделе "Каталог" на нашем сайте. Товары, которые есть в наличии, имеют соответствующую пометку.',
    },
    {
        id: 4,
        question: "Где посмотреть наличие товара?",
        answer:
            "Для проверки наличия товара перейдите на страницу товара. Если товар доступен для заказа, вы сможете добавить его в корзину.",
    },
    {
        id: 5,
        question: "Где посмотреть наличие товара?",
        answer:
            "Вы можете узнать о наличии товара на странице товара или обратиться к нашим консультантам через чат поддержки.",
    },
]

export default function FaqAccordion() {
    const [openItem, setOpenItem] = useState<number | null>(null)

    const toggleItem = (id: number) => {
        setOpenItem(openItem === id ? null : id)
    }

    return (
        <div className=" divide-y">
            {faqData.map((item) => (
                <div key={item.id} className="overflow-hidden mdbvp:w-[648px] sml:w-[340px] w-full font-semibold text-[#161616] ">
                    <button
                        onClick={() => toggleItem(item.id)}
                        className="flex gap-4 items-center sml:text-[16px] text-[14px] mdbvp:w-[648px] sml:w-[340px] w-full p-4 text-left focus:outline-none"
                        aria-expanded={openItem === item.id}
                    >
                        <ChevronDown
                            className={`h-5 w-5 text-[#161616] transition-transform duration-200 ${
                                openItem === item.id ? "transform rotate-180" : ""
                            }`}
                        />
                        <span>{item.question}</span>
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            openItem === item.id ? "max-h-40 p-4 pt-0" : "max-h-0"
                        }`}
                    >
                        <p className="sml:text-[16px] text-[14px] text-[#161616]">{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
