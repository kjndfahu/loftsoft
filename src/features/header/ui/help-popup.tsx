import {ArrowRight, CopyLogo2, MailLogo, TgLogo, WhatsUpLogo} from "@/shared/icons";

export const HelpModal = ({setIsClicked}:{setIsClicked:(arg: boolean) => void}) => {

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsClicked(false);
        }
    };

    return (
        <div onClick={handleBackdropClick} className="flex z-[100] items-center justify-center fixed top-[50px] right-[150px]">
            <div
                onClick={e => e.stopPropagation()}>
                <div className="flex w-[353px] bg-white rounded-[15px] shadow-lg flex-col gap-[10px] p-5">
                    <h4 className="text-[16px] text-[#161616] font-semibold">Помощь</h4>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between py-[10px]">
                            <div className="flex gap-[10px]">
                                <TgLogo/>
                                <p className="font-medium text-[#161616] text-[12px]">Написать в Telegram</p>
                            </div>
                            <ArrowRight/>
                        </div>
                        <div className="flex items-center justify-between py-[10px]">
                            <div className="flex gap-[10px]">
                                <WhatsUpLogo/>
                                <p className="font-medium text-[#161616] text-[12px]">Написать в Whatsapp</p>
                            </div>
                            <ArrowRight/>
                        </div>
                        <div className="flex items-center justify-between py-[10px]">
                            <div className="flex gap-[10px]">
                                <MailLogo/>
                                <p className="font-medium text-[#161616] text-[12px]">loft.soft@gmail.com</p>
                            </div>
                            <CopyLogo2/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}