import type React from "react"
import { X } from "lucide-react"
import type { FC } from "react"

interface QuestionAnswerItemProps {
    index: number
    question: string
    answer: string
    onChange: (index: number, question: string, answer: string) => void
    onRemove: (index: number) => void
}

export const QuestionAnswerItem: FC<QuestionAnswerItemProps> = ({
                                                                    index,
                                                                    question,
                                                                    answer,
                                                                    onChange,
                                                                    onRemove,
                                                                }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1">
                <textarea
                    className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px] text-[#161616] min-h-[44px] text-[16px] resize-y"
                    placeholder="Вопрос"
                    value={question}
                    onChange={(e) => onChange(index, e.target.value, answer)}
                />
            </div>
            <div className="flex-1">
                <textarea
                    className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px] text-[#161616] min-h-[44px] text-[16px] resize-y"
                    placeholder="Ответ"
                    value={answer}
                    onChange={(e) => onChange(index, question, e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-[#161616] p-2"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}