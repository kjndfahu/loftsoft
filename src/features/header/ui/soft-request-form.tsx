"use client"

import type React from "react"
import { useState } from "react"
import { CrossLogo } from "@/shared/icons"
import {createSoftRequest} from "@/enteties/soft-requests/soft-request";


interface SoftRequestFormProps {
    setIsClicked: (arg: boolean) => void
}

export type SoftRequestFormData = {
    name: string
    email: string
    program: string
    comment: string
    privacyPolicy: boolean
}

export const SoftRequestForm = ({ setIsClicked }: SoftRequestFormProps) => {
    const [formData, setFormData] = useState<SoftRequestFormData>({
        name: "",
        email: "",
        program: "",
        comment: "",
        privacyPolicy: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.privacyPolicy) {
            setError("Необходимо согласиться с политикой конфиденциальности")
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            const result = await createSoftRequest(formData)

            if (result.success) {
                setSuccess(true)
                // Reset form after successful submission
                setFormData({
                    name: "",
                    email: "",
                    program: "",
                    comment: "",
                    privacyPolicy: false,
                })
                setTimeout(() => setIsClicked(false), 2000)
            } else {
                setError(result.error || "Произошла ошибка при отправке запроса")
            }
        } catch (err) {
            setError("Произошла ошибка при отправке запроса")
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:w-[360px] w-full bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-[40px]">
                <h3 className="text-[22px] font-bold text-[#161616]">Запрос на товар</h3>
                <button type="button" onClick={() => setIsClicked(false)} className="text-black">
                    <CrossLogo />
                </button>
            </div>

            {success ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-green-500 mb-2">✓</div>
                    <p className="text-center text-[#161616] font-medium">Запрос успешно отправлен!</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400" htmlFor="name">
                                Имя
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Введите имя"
                                className="text-sm text-[#161616] outline-none w-full rounded-full border border-gray-300 px-4 py-3"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ваша почта"
                                className="text-sm text-[#161616] outline-none w-full rounded-full border border-gray-300 px-4 py-3"
                                type="email"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400" htmlFor="program">
                                Программа
                            </label>
                            <input
                                id="program"
                                name="program"
                                value={formData.program}
                                onChange={handleChange}
                                placeholder="Название программы"
                                className="text-sm text-[#161616] outline-none w-full rounded-full border border-gray-300 px-4 py-3"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400" htmlFor="comment">
                                Комментарии
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Напишите комментарий"
                                className="text-sm text-[#161616] outline-none w-full rounded-[12px] border border-gray-300 px-4 py-3 min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="flex items-start gap-2 mt-1">
                            <input
                                id="privacyPolicy"
                                name="privacyPolicy"
                                type="checkbox"
                                checked={formData.privacyPolicy}
                                onChange={handleChange}
                                className="mt-1"
                                required
                            />
                            <label htmlFor="privacyPolicy" className="text-xs text-gray-600">
                                Ознакомлен и согласен с условиями <span className="font-bold">политики конфиденциальности</span>.
                            </label>
                        </div>
                    </div>

                    {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

                    <div className="flex gap-2 mt-[38px]">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-sm font-semibold text-white bg-black border border-black rounded-full px-6 py-2 disabled:opacity-70"
                        >
                            {isSubmitting ? "Отправка..." : "Отправить запрос"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsClicked(false)}
                            className="text-sm font-semibold text-[#161616] border border-gray-300 rounded-full px-4 py-2 min-w-[80px]"
                        >
                            Отмена
                        </button>
                    </div>
                </>
            )}
        </form>
    )
}
