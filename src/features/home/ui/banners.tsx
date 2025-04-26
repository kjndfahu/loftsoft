import Banner from '../../../../public/img/banner-shape.png'
import Image from 'next/image'

export const Banners = () => {
    return (
        <div className="flex w-full gap-6">
            <div className="flex flex-col w-1/2 relative gap-4 p-10 h-[536px] banner-1 rounded-[20px]">
                <h2 className="text-white text-[34px] leading-[40px] font-semibold">Открой полный доступ<br/> к
                    программам и сервисам</h2>
                <p className="text-[16px] leading-6">Лицензионные ключи для софта и онлайн-<br/>сервисов. Быстрая
                    доставка, гарантия<br/> активации и круглосуточная поддержка 24/7</p>
                <div className="flex gap-[10px]">
                    <button
                        className="text-[16px] w-[100px] h-[42px] font-semibold bg-white rounded-full text-[#161616]">
                        Каталог
                    </button>
                    <button
                        className="border-[1px] w-[119px] h-[42px] border-white text-[16px] font-semibold bg-transparent rounded-full text-white">
                        Связаться
                    </button>
                </div>
                <Image className="absolute bottom-0 right-0 rounded-br-[20px]" alt="banner" src={Banner}/>
            </div>

            <div className="flex flex-col bg-banner2 bg-cover w-1/2 relative gap-4 p-10 h-[536px] rounded-[20px]">
                <h2 className="text-[#424141] text-[34px] leading-[40px] font-semibold">Adobe Creative<br/>
                    Cloude 2024</h2>
                <p className="text-[16px] text-[#343434] leading-6">20+ креативных предложений.<br/> Бесконечные возможности</p>
                <div className="flex gap-[10px]">
                    <button
                        className="text-[16px] w-[91px] h-[42px] font-semibold bg-[#5069E8] rounded-full text-white">
                        Купить
                    </button>
                </div>
            </div>
        </div>
    )
}