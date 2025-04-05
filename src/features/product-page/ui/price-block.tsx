export const PriceBlock = () => {
    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[30px] p-6">
            <h4 className="text-[36px] font-semibold text-[#161616]">14599₽</h4>
            <div className="flex flex-col gap-[12px]">
                <button
                    className="rounded-full py-[10px] w-[266px] text-[16px] text-white font-semibold bg-[#5069E8]">Добавить
                    в корзину
                </button>
            </div>
        </div>
    )
}