export const TotalReviews = ({reviews}:{reviews: number}) => {
    return (
        <div className="flex mds:flex-1 mds:w-auto w-full flex-col gap-2 md:p-6 p-3.5 border-[1px] border-[#DBDEEF] rounded-[16px]">
            <h2 className="md:text-[16px] text-[13px] font-medium text-[#333438]">Всего отзывов</h2>
            <div className="flex items-center mt-2 sml:gap-2 gap-1">
                <h2 className="md:text-[36px] sml:text-[28px] text-[24px] text-[#161616] md:leading-[40px] sml:leading-[32px] leading-[28px] font-semibold">{reviews}</h2>
                <div
                    className="md:text-[14px] text-[12px] leading-[18px] font-medium text-[#5069E8] rounded-full bg-[#F5F7FF] py-[3px] px-[10px]">21%↝
                </div>
            </div>
            <p className="md:text-[14px] sml:text-[12px] text-[11px] text-[#4E4F56]">Рост числа отзывов за этот год</p>
        </div>
    )
}