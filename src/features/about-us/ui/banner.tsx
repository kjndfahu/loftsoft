import { Banner1, Banner2 } from "@/shared/successful-images"

export const Banner = () => {
    return (
        <div className="flex flex-col relative overflow-hidden items-center sml:gap-8 gap-6 about-us-bg md:py-12 py-8 rounded-[24px] w-full md:h-[269px] sml:h-[200px] h-[374px]">
            <div className="flex flex-col items-center justify-center text-center gap-3 font-medium">
                <h3 className="lg:text-[48px] md:text-[32px] text-[24px] text-white lg:leading-[60px] md:leading-[38px] leading-7 sml:w-full w-[250px]">Для сотрудничества пишите нам</h3>
                <p className="md:w-full w-[250px] lg:text-[16px] md:text-[14px] text-[12px] text-center text-[#FFFFFFCC] lg:leading-[23px] md:leading-4 leading-[14px]">Мы уже сотрудничаем с такими то такими компаниями на протяжении х времени</p>
            </div>
            <button className="w-[218px] rounded-full text-[#161616] text-[16px] leading-[19px] font-semibold py-[10px] bg-white">Связаться</button>
            <Banner1 className="absolute sml:w-[293px] w-[200px] sml:bottom-auto bottom-0 sml:top-0 mdbvp:left-0 md:left-[-70px] sml:left-[-120px] left-[-100px]"/>
            <Banner2 className="absolute sml:w-[293px] w-[200px] sml:bottom-auto bottom-0 sml:top-0 mdbvp:right-0 md:right-[-70px] sml:right-[-120px] right-[-100px]"/>
        </div>
    )
}