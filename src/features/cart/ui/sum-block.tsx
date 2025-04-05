export const SumBlock = () => {
    return (
        <div className="flex flex-col rounded-[20px] gap-5 p-6 bg-[#F5F7FF]">
            <div className="flex items-center justify-between">
                <h5 className="text-[22px] text-[#161616]">Итого</h5>
                <h4 className="text-[36px] text-[#161616]">14599<span className="text-[18px]">₽</span> </h4>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[16px] text-[#6A6B75]">
                    <p>4 товара</p>
                    <p>22599₽</p>
                </div>
                <div className="flex items-center justify-between text-[16px] text-[#6A6B75]">
                    <div className="flex gap-3">
                        <p>Скидка</p>
                        <div className="rounded-full bg-[#FEECEE] text-[#E71730] text-[11px] p-1">-24%</div>
                    </div>
                    <p>-4030₽</p>
                </div>
            </div>
        </div>
    )
}