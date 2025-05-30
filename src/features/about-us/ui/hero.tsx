import Link from "next/link";
import {LogoList} from "@/features/about-us/ui/logo-list";
import Image from 'next/image'
import frame from '../../../../public/img/about-us-frame.avif'

export const Hero = () => {
    return (
        <div className="flex items-center text-center flex-col gap-5">
            <div
                className="flex z-[3] py-2 px-[18px] bg-[#E9EBF6] gap-2 text-[16px] font-medium text-[#161616] rounded-full">✦ 3.000+
                продано лицензий ✦
            </div>
            <h1 className="md:text-[48px] sml:text-[32px] text-[24px] z-[3] md:leading-[60px] sml:leading-[40px] leading-[32px] text-[#161616] font-medium">Интернет магазин с цифровыми ключами.<br/> Получите
                доступ <span className="font-bold text-[#5069E8]">↝</span> к лучшему программному<br/> обеспечению c
                <span className="font-bold text-[#5069E8]"> LoftSoft.</span></h1>
            <p className="sml:w-[575px] w-[302px] z-[3] font-medium text-[#4E4F56] md:text-[20px] sml:text-[16px] text-[14px]">Наш магазин – надежный партнер для всех,
                кому требуется купить
                <span className="text-[#5069E8]"> оригинальные ключи активации и коды для ПО.</span></p>
            <div className="flex sm:flex-row flex-col items-center justify-center w-full z-[3] sm:gap-4 gap-2">
                <Link href="/catalog">
                    <button className="text-[16px] sm:w-auto w-[90vw] text-white font-semibold rounded-full px-6 sml:py-3 py-2 bg-[#5069E8]">Перейти
                        в
                        каталог
                    </button>
                </Link>
                <Link href="/reviews">
                    <button
                        className="text-[16px] text-[#161616] sm:w-auto w-[90vw] bg-white font-semibold rounded-full px-6 sml:py-3 py-2 border-[1px] border-[#CACDDC]">Отзывы покупателей
                    </button>
                </Link>
            </div>
            <LogoList/>
            <Image className="absolute w-[1600px] z-[1] xl:top-[0px] lg:top-[70px] md:top-[120px] top-[250px]" alt="frame" src={frame}/>
        </div>
    )
}