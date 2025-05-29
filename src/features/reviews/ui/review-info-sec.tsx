import Image from "next/image";
import yandex from "../../../../public/img/yandex.avif";
import {ReviewStar} from "@/shared/icons";
import avito from "../../../../public/img/avito.avif";
import shine from "../../../../public/img/shine.avif";
import spiral from "../../../../public/img/spiral.avif";

export const ReviewInfoSec = () => {
    return (
        <div
            className="flex flex-col lg:w-[480px] md:w-[400px] mds:w-[320px] w-full items-center mds:justify-center justify-between overflow-hidden gap-4 mds:px-0 px-[23px] pt-16 mds:pt-7 lg:pb-10 pb-5 relative info rounded-[16px]">
            <div className="flex flex-col lg:gap-4 gap-3">
                <h2 className="lg:text-[20px] text-[17px] text-center lg:leading-[25px] leading-[23px] text-white font-medium">
                    Нам доверяют более 3000 человек
                </h2>
            </div>
            <div className="flex mds:flex-row flex-col z-[5] lg:gap-4 gap-2.5">
                <div
                    className="flex border-[1px] bg-[#FFFFFF0F] backdrop-blur-sm md:rounded-[16px] rounded-[10px] border-[#FFFFFF40] items-center justify-center mds:w-auto w-[80vw] md:py-3 py-2 md:px-6 px-1 md:gap-2 gap-1">
                    <Image className="lg:w-[40px] md:w-[35px] w-[30px] lg:h-[40px] md:h-[35px] h-[30px]" alt="yandex" src={yandex}/>
                    <div className="flex flex-col ">
                        <h5 className="md:text-[16px] text-[14px] md:leading-5 leading-4 font-medium">Яндекс</h5>
                        <div className="flex items-center gap-1">
                            <ReviewStar className="md:w-[15px] w-[13px] md:h-[14px] h-[12px]"/>
                            <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                        </div>
                    </div>
                </div>

                <div
                    className="flex border-[1px] bg-[#FFFFFF0F] backdrop-blur-sm md:rounded-[16px] rounded-[10px] border-[#FFFFFF40] items-center justify-center mds:w-auto w-[80vw] md:py-3 py-2 md:px-6 px-1 md:gap-2 gap-1">
                    <Image className="lg:w-[40px] md:w-[35px] w-[30px] lg:h-[40px] md:h-[35px] h-[30px]" alt="avito" src={avito}/>
                    <div className="flex flex-col ">
                        <h5 className="md:text-[16px] text-[14px] md:leading-5 leading-4 font-medium">Avito</h5>
                        <div className="flex items-center gap-1">
                            <ReviewStar className="md:w-[15px] w-[13px] md:h-[14px] h-[12px]"/>
                            <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                        </div>
                    </div>
                </div>
            </div>

            <Image width={20} height={20} alt="shine" src={shine}
                   className="absolute z-[1] -scale-x-100 lg:top-[25px] top-[23px] lg:left-[50px] left-[30px]"/>
            <Image width={12} height={12} alt="shine" src={shine}
                   className="absolute z-[1] lg:top-[57px] top-[50px] lg:right-[60px] right-[40px]"/>
            <Image alt="spiral" src={spiral}
                   className="absolute z-[1] rotate-[70deg] aspect-445/390 w-[107px] -scale-x-100 lg:top-[-10px] top-[-20px] lg:left-[-23px] left-[-30px] rounded-l-[36px]"/>
            <Image alt="spiral" src={spiral}
                   className="absolute z-[1] -rotate-[75deg] aspect-445/390 w-[98px] lg:top-[-10px] top-[-20px] lg:right-[-14px] right-[-20px] rounded-r-[36px]"/>
        </div>
    )
}