import { Banner1, Banner2 } from "@/shared/successful-images"

export const Banner = () => {
    return (
        <div className="flex flex-col relative overflow-hidden items-center gap-8 about-us-bg py-12 rounded-[24px] w-full h-[269px]">
            <div className="flex flex-col gap-3 font-medium">
                <h3 className="text-[48px] text-white leading-[60px]">Для сотрудничества пишите нам</h3>
                <p className="text-[16px] text-center text-[#FFFFFFCC] leading-[23px]">Мы уже сотрудничаем с такими то такими компаниями на протяжении х времени</p>
            </div>
            <button className="w-[218px] rounded-full text-[#161616] text-[16px] leading-[19px] font-semibold py-[10px] bg-white">Связаться</button>
            <Banner1 className="absolute top-0 left-0"/>
            <Banner2 className="absolute top-0 right-0"/>
        </div>
    )
}