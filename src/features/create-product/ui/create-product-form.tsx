"use client"

import type React from "react"

import { CrossLogo } from "@/shared/icons"
import type { FC } from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { UploadIcon } from "lucide-react"

interface Props {
    setIsOpen: (arg: boolean) => void
}

export const CreateProductForm: FC<Props> = ({ setIsOpen }) => {
    const [image, setImage] = useState<string | null>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }


    return (
        <form className="flex flex-col gap-4 w-[500px] pt-4 pb-7 px-6 bg-white rounded-[16px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Создать товар</h3>
                <div>
                    <CrossLogo className="w-6 h-6 cursor-pointer"/>
                </div>
            </div>

            <div
                className={`relative h-[300px] rounded-[16px] overflow-hidden ${
                    image ? "" : "bg-[#B9BCCB]"
                } cursor-pointer transition-all duration-200 ${
                    isHovering && !image ? "bg-[#A4A8BA]" : ""
                } flex items-center justify-center`}
                onClick={handleImageClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {image ? (
                    <>
                        <Image src={image || "/placeholder.svg"} alt="Category image" fill
                               style={{objectFit: "cover"}}/>
                        <div
                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div
                                className="bg-white p-2 rounded-full opacity-0 hover:opacity-100 transition-all duration-200">
                                <UploadIcon className="w-6 h-6 text-[#161616]"/>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                        <UploadIcon className="w-10 h-10 mb-2"/>
                        <p className="text-sm font-medium">Нажмите, чтобы загрузить изображение</p>
                        <p className="text-xs opacity-70 mt-1">Рекомендуемый размер: 424x133px</p>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
            </div>

            <div className="flex items-center gap-3">
                <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                    <input
                        className="bg-transparent w-full outline-0 text-[#161616]"
                        placeholder="Введите название товара"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            </div>


            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                        <input
                            className="bg-transparent w-full outline-0 text-[#161616]"
                            placeholder="Цена"
                            type="number"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>
                <div
                    className="flex w-[230px] h-[46px] items-center justify-center border-[1px] border-[#B9BCCB] rounded-[20px]">Категория
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div
                    className="flex w-[230px] h-[46px] items-center justify-center border-[1px] border-[#B9BCCB] rounded-[20px]">Вид подписки
                </div>
                <div
                    className="flex w-[230px] h-[46px] items-center justify-center border-[1px] border-[#B9BCCB] rounded-[20px]">Срок лицензии
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
          <textarea
              className="bg-transparent w-full outline-0 text-[#161616]"
              placeholder="Введите описание товара"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
                </div>
            </div>

            <div className="flex justify-end pt-2 gap-[6px]">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-[16px] w-[97px] h-[42px] font-semibold text-[#161616] border-[1px] border-[#DBDEEF] rounded-full bg-white"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className={`text-[16px] w-[122px] h-[42px] font-semibold text-[#ffffff] border-[1px] border-[#DBDEEF] rounded-full bg-[#161616]`}
                >
                    Создать
                </button>
            </div>
        </form>
    )
}
