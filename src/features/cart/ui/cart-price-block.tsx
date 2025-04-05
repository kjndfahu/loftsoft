'use client'

export const CartPriceBlock = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <h4 className="text-[24px] text-[#161616]">14599₽</h4>
                <p className="text-[14px] text-[#858692] line-through">33599₽</p>
            </div>
            <div className="flex text-[16px] text-[#161616] gap-6 px-[18px] py-[11px] rounded-full border-[1px] border-[#DBDEEF]">
                <span className="cursor-pointer">-</span>
                <span>-</span>
                <span className="cursor-pointer">+</span>
            </div>
        </div>
    )
}