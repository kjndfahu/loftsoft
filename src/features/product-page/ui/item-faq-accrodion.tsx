"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type QuestionAnswer = {
    id: number
    question: string
    answer: string
}

type ItemFaqAccordionProps = {
    questions: QuestionAnswer[]
}

export default function ItemFaqAccordion({ questions }: ItemFaqAccordionProps) {
    const [openItem, setOpenItem] = useState<number | null>(null)

    const toggleItem = (id: number) => {
        setOpenItem(openItem === id ? null : id)
    }

    return (
        <div className="divide-y">
            {questions.map((item) => (
                <div key={item.id} className="overflow-hidden mdbvp:w-[648px] sml:w-[340px] w-full font-semibold text-[#161616]">
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