"use client"

import { useEffect, useRef, useState } from "react"
import { CopyLogo2, MailLogo, TgLogo, WhatsUpLogo } from "@/shared/icons"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { CopyBlock } from "@/features/header/ui/copy-block"
import {showToast} from "@/shared/custom-toast";


export const HelpModal = ({ setIsClicked }: { setIsClicked: (arg: boolean) => void }) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const [showCopyBlock, setShowCopyBlock] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (modalRef.current && !modalRef.current.contains(target)) {
                setIsClicked(false)
            }
        }

        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [setIsClicked])

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("loft.soft@gmail.com")
        setShowCopyBlock(true)
        showToast("Email скопирован!", "success", {
            duration: 2000,
            position: "top-center",
            secondaryMessage: "",
        })
        setTimeout(() => {
            setShowCopyBlock(false)
        }, 1000)
    }

    return (
        <div className="flex z-[100] items-center justify-center fixed top-[50px] right-[150px]">
            <div ref={modalRef} className="flex w-[353px] bg-white rounded-[15px] shadow-lg flex-col gap-[10px] p-5">
                <h4 className="text-[16px] text-[#161616] font-semibold">Помощь</h4>
                <div className="flex relative flex-col">
                    <Link href="https://t.me/loftsoft_support">
                        <div className="flex items-center justify-between cursor-pointer text-[#161616] py-[10px]">
                            <div className="flex items-center gap-[10px]">
                                <TgLogo className="w-[20px] h-[20px]" />
                                <p className="font-medium text-[12px]">Написать в Telegram</p>
                            </div>
                            <ChevronRight className="w-[15px] h-[15px]" />
                        </div>
                    </Link>
                    <Link href="https://wa.me/77070182926">
                        <div className="flex items-center justify-between cursor-pointer text-[#161616] py-[10px]">
                            <div className="flex items-center gap-[10px]">
                                <WhatsUpLogo className="w-[18px] h-[18px]" />
                                <p className="font-medium text-[12px]">Написать в Whatsapp</p>
                            </div>
                            <ChevronRight className="w-[15px] h-[15px]" />
                        </div>
                    </Link>
                    <div
                        className="flex items-center justify-between cursor-pointer text-[#161616] py-[10px]"
                        onClick={handleCopyEmail}
                    >
                        <div className="flex items-center gap-[10px]">
                            <MailLogo className="w-[20px] h-[20px]" />
                            <p className="font-medium text-[12px]">loft.soft@gmail.com</p>
                        </div>
                        <CopyLogo2 />
                    </div>
                    {showCopyBlock && <CopyBlock />}
                </div>
            </div>
        </div>
    )
}