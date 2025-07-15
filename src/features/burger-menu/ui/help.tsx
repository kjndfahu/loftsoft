import {showToast} from "@/shared/custom-toast";
import Link from "next/link";
import {CopyLogo2, CrossLogo, MailLogo, TgLogo, WhatsUpLogo} from "@/shared/icons";
import {ChevronRight} from "lucide-react";
import {CopyBlock} from "@/features/header/ui/copy-block";
import {useState} from "react";

export const Help = () => {
    const [showCopyBlock, setShowCopyBlock] = useState(false)

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
        <div className="flex w-full sm:px-5">
            <div className="flex sm:w-full w-[96vw] bg-white rounded-t-[15px] sm:rounded-b-[15px] shadow-lg flex-col gap-[10px] p-5">
                <div className="flex items-center justify-between">
                    <h4 className="text-[16px] text-[#161616] font-semibold">Помощь</h4>
                    <CrossLogo className="w-[20px] h-[20px]" />
                </div>
                <div className="flex relative flex-col">
                <Link href="https://t.me/loftsoft_support">
                        <div className="flex items-center justify-between cursor-pointer text-[#161616] py-[10px]">
                            <div className="flex items-center gap-[10px]">
                                <TgLogo className="w-[20px] h-[20px]"/>
                                <p className="font-medium text-[12px]">Написать в Telegram</p>
                            </div>
                            <ChevronRight className="w-[15px] h-[15px]"/>
                        </div>
                    </Link>
                    <Link href="https://wa.me/77070182926">
                        <div className="flex items-center justify-between cursor-pointer text-[#161616] py-[10px]">
                            <div className="flex items-center gap-[10px]">
                                <WhatsUpLogo className="w-[18px] h-[18px]"/>
                                <p className="font-medium text-[12px]">Написать в Whatsapp</p>
                            </div>
                            <ChevronRight className="w-[15px] h-[15px]"/>
                        </div>
                    </Link>
                    <div
                        className="flex items-center justify-between cursor-pointer text-[#161616] py-[10px]"
                        onClick={handleCopyEmail}
                    >
                        <div className="flex items-center gap-[10px]">
                            <MailLogo className="w-[20px] h-[20px]"/>
                            <p className="font-medium text-[12px]">loft.soft@gmail.com</p>
                        </div>
                        <CopyLogo2/>
                    </div>
                    {showCopyBlock && <CopyBlock/>}
                </div>
            </div>
        </div>
    )
}