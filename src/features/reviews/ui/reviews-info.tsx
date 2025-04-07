import {InfoBlockMini} from "@/features/articles/ui/info-block-mini";

export const ReviewsInfo = () => {
    return (
        <div className="flex gap-6">
            <div className="flex flex-col rounded-[16px] p-6 border-[1px] border-[#DBDEEF]">
                <h4 className="text-[16px] font-medium text-[#333438]">Всего отзывов</h4>
                <div className="flex items-center gap-2">
                    <h3 className="text-[36px] text-[#161616] font-semibold">1.3</h3>
                    <div className="rounded-full h-[25px] text-[14px] text-[#5069E8] font-medium px-[10px] py-[3px] bg-[#F5F7FF]">
                        21%↝
                    </div>
                </div>
                <p className="text-[14px] text-[#4E4F56]">Рост числа отзывов за этот год</p>
            </div>

            <InfoBlockMini/>
        </div>
    )
}