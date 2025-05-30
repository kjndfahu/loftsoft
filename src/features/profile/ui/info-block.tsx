
import {ReviewStar} from "@/shared/icons";
import Image from "next/image";
import spiral from '../../../../public/img/spiral.avif'
import shine from '../../../../public/img/shine.avif'
import yandex from '../../../../public/img/yandex.avif'
import avito from '../../../../public/img/avito.avif'
import Link from "next/link";

export const InfoBlock = () => {
    return (
        <div className="flex flex-col w-full items-center mds:justify-center justify-between overflow-hidden gap-4 mds:px-0 px-[23px] lg:pt-16 mds:pt-7 pt-24 pb-10 relative info mds:rounded-[36px] rounded-[20px] lg:h-[390px] mds:h-[289px] h-[600px]">
            <div className="flex flex-col gap-4">
                <h2 className="lg:text-[48px] lg:leading-[55px] mds:text-[38px] text-[27px] mds:leading-[43px] leading-[33px] mds:text-center text-white font-medium">Нам
                    доверяют более 3000 <span className="text-[#CED7FF]">человек<br/>
                каждый месяц, будь в их числе</span></h2>
                <p className="lg:text-[16px] text-[16px] lg:leading-[20px] leading-[16px] mds:text-center text-[#FFFFFFCC]">В
                    этом разделе вы найдёте отзывы наших клиентов и ссылки на популярные<br/> сервисы для ознакомления с
                    дополнительными отзывами</p>
            </div>
            <div className="flex mds:flex-row flex-col z-[5] pt-6 mds:gap-4 gap-2.5">
                <Link href="https://yandex.com">
                    <div
                        className="flex border-[1px] bg-[#FFFFFF0F] backdrop-blur-sm rounded-[16px] border-[#FFFFFF40] items-center justify-center mds:w-auto w-[80vw] py-3 px-6 gap-2">
                        <Image alt="yandex" src={yandex}/>
                        <div className="flex flex-col ">
                            <h5 className="text-[16px] leading-5 font-medium">Яндекс</h5>
                            <div className="flex items-center gap-1">
                                <ReviewStar/>
                                <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="https://www.avito.ru">
                    <div
                        className="flex border-[1px] bg-[#FFFFFF0F] backdrop-blur-sm rounded-[16px] border-[#FFFFFF40] items-center justify-center mds:w-auto w-[80vw] py-3 px-6 gap-2">
                        <Image alt="avito" src={avito}/>
                        <div className="flex flex-col ">
                            <h5 className="text-[16px] leading-5 font-medium">Avito</h5>
                            <div className="flex items-center gap-1">
                                <ReviewStar/>
                                <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <Image alt="shine" src={shine}
                   className="absolute z-[1] lg:top-[55px] top-[30px] xl:left-[230px] lg:left-[150px] md:left-[100px] left-[50px]"/>
            <Image width={20} height={20} alt="shine" src={shine}
                   className="absolute z-[1] -scale-x-100 mds:top-[38px] top-[190px] xl:right-[370px] lg:right-[230px] md:right-[120px] mds:right-[70px] right-[25px]"/>
            <Image width={12} height={12} alt="shine" src={shine}
                   className="absolute z-[1] mds:top-[75px] top-[220px] xl:right-[350px] lg:right-[200px] md:right-[100px] mds:right-[50px] right-[10px]"/>
            <Image alt="spiral" src={spiral}
                   className="absolute z-[1] mds:rotate-0 -rotate-12 aspect-445/390 lg:w-[445px] w-[330px] -scale-x-100 mds:top-0 top-[-220px] mds:right-0 right-[-100px] md:left-0 mds:left-[-120px] left-auto rounded-l-[36px]"/>
            <Image alt="spiral" src={spiral} className="absolute z-[1] aspect-445/390 lg:w-[445px] mds:w-[330px] w-[470px] mds:top-0 sm:top-[320px] top-[350px] md:right-0 mds:right-[-120px] right-[-50px] rounded-r-[36px]"/>
        </div>
    )
}