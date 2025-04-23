import Link from "next/link";
import {LogoList} from "@/features/about-us/ui/logo-list";

export const Hero = () => {
    return (
        <div className="flex items-center text-center flex-col gap-5">
            <div
                className="flex py-2 px-[18px] bg-[#E9EBF6] gap-2 text-[16px] font-medium text-[#161616] rounded-full">3.000+
                продано лицензий
            </div>
            <h1 className="text-[48px] leading-[60px] text-[#161616] font-medium">Интернет магазин с цифровыми ключами.<br/> Получите
                доступ <span className="font-bold text-[#5069E8]">↝</span> к лучшему программному<br/> обеспечению c
                <span className="font-bold text-[#5069E8]"> LoftSoft.</span></h1>
            <p className="w-[575px] font-medium text-[#4E4F56] text-[20px]">Наш магазин – надежный партнер для всех,
                кому требуется купить
                <span className="text-[#5069E8]">оригинальные ключи активации и коды для ПО.</span></p>
            <div className="flex gap-4">
                <Link href="/catalog">
                    <button className="text-[16px] text-white font-semibold rounded-full px-6 py-3 bg-[#5069E8]">Перейти
                        в
                        каталог
                    </button>
                </Link>
                <Link href="/">
                    <button
                        className="text-[16px] text-[#161616] font-semibold rounded-full px-6 py-3 border-[1px] border-[#CACDDC]">Отзывы покупателей
                    </button>
                </Link>
            </div>
            <LogoList/>
        </div>
    )
}