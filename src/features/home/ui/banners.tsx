import Banner from '../../../../public/img/banner-shape.png'
import ChromeShape from '../../../../public/img/chrome-shape.avif'
import Image from 'next/image'
import {Banner2} from "@/features/home/ui/banner-2";
import Link from "next/link";

export const Banners = () => {
    return (
        <div className="flex mds:flex-row flex-col w-full gap-6">
            <div className="flex flex-col mds:w-1/2 w-full relative sm:gap-4 gap-2.5 mds:p-10 p-5 sm:h-[536px] h-[240px] banner-1 rounded-[20px]">
                <h2 className="z-[3] text-white md:text-[34px] sm:text-[24px] text-[20px] md:leading-[40px] sm:leading-[28px] leading-[24px] font-semibold">Открой полный доступ<br/> к
                    программам и сервисам</h2>
                <p className="z-[3] md:text-[16px] sml:text-[14px] text-[12px] text-white md:leading-6 sml:leading-4 leading-[14px]">Лицензионные ключи для софта и онлайн-<br/>сервисов. Быстрая
                    доставка, гарантия<br/> активации и круглосуточная поддержка 24/7</p>
                <div className="flex z-[3] gap-[10px]">
                    <Link href="/catalog">
                        <button
                            className="md:text-[16px] text-[14px] md:leading-6 leading-4 w-[100px] h-[42px] font-semibold bg-white rounded-full text-[#161616]">
                            Каталог
                        </button>
                    </Link>
                    <Link href="/catalog">
                        <button
                            className="border-[1px] w-[119px] h-[42px] backdrop-blur-sm border-white md:text-[16px] text-[14px] md:leading-6 leading-4 font-semibold bg-transparent rounded-full text-white">
                            Связаться
                        </button>
                    </Link>
                </div>
                <Image
                    className="sm:flex hidden absolute aspect-590/421 sm:w-[500px] w-[270px] mix-blend-luminosity z-[1] bottom-0 right-0 rounded-br-[20px]"
                    alt="banner" src={Banner}/>
                <Image
                    className="sm:hidden flex absolute aspect-590/421 sm:w-[421px] w-[270px] mix-blend-luminosity z-[1] bottom-0 s:right-[10%] right-[3%] rounded-br-[20px]" alt="banner" src={ChromeShape}/>
            </div>

            <Banner2/>
        </div>
    )
}