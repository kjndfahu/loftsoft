import gradient1 from '../../../../public/img/gradient-glass.avif'
import gradient2 from '../../../../public/img/gradient-glass-2.avif'
import gradient3 from '../../../../public/img/gradient-glass-3.avif'
import Image from 'next/image'

export const BenefitsLoftsoft = () => {
    return (
        <div className="flex flex-col items-center gap-8">
            <h1 className="mds:text-[40px] sm:text-[32px] text-[24px] text-center mds:leading-[55px] sm:leading-[40px] leading-[36px] font-medium text-[#161616]">Преимущества <span className="text-[#5069E8]">с LoftSoft</span></h1>
            <div className="flex flex-col w-full mds:gap-6 gap-3">
                <div className="flex mds:flex-row flex-col mds:gap-6 gap-3 w-full">
                    <div className="flex relative overflow-hidden flex-col gap-4 p-8 flex-1 md:h-[460px] mds:h-[350px] h-[240px] bg-[#161616] rounded-[24px]">
                        <h2 className="text-[#FFFFFF] md:text-[27px] text-[18px] md:leading-[33px] leading-[22px] font-semibold">Доступные цены</h2>
                        <p className="md:text-[16px] text-[14px] md:leading-6 leading-4 text-[#CACDDC]">Мы предлагаем
                            оптимальные<br/> цены, чтобы каждый клиент мог<br/> приобрести нужный продукт<br/> без
                            переплат.
                        </p>
                        <Image className="lg:flex hidden absolute right-[10px] top-0" alt="gradient1" src={gradient1}/>
                        <Image className="absolute aspect-390/225 lg:w-[350px] md:w-[280px] w-[190px] lg:right-[350px] md:right-[300px] right-[200px] bottom-0" alt="gradient2" src={gradient2}/>
                        <Image className="absolute aspect-231/177 lg:w-[231px] md:w-[200px] w-[160px] right-[-10px] bottom-0" alt="gradient3" src={gradient3}/>
                    </div>
                    <div
                        className="flex flex-col aspect-424/460 bg-[#D8D8D8] bg-microsoft bg-cover bg-no-repeat mds:bg-[position:0px_150px] bg-[position:0px_100px] relative gap-4 mds:p-10 p-6 md:h-[460px] md:w-[424px] mds:h-[350px] h-[240px] rounded-[20px]">
                        <h2 className="text-[#161616] md:text-[27px] text-[18px] md:leading-[33px] leading-[22px] font-semibold">Эксклюзивные<br/>
                            товары</h2>
                        <p className="md:text-[16px] text-[14px] md:leading-6 leading-4 text-[#333438]">В нашем
                            ассортименте только<br/> оригинальные цифровые ключи,<br/> включая эксклюзивные предложения.
                        </p>
                    </div>
                </div>
                <div className="flex mds:flex-row flex-col mds:gap-6 gap-3 w-full">
                    <div
                        className="flex flex-col aspect-424/460 justify-end bg-[#c7dcff] relative gap-4 mds:p-10 p-6 md:h-[460px] md:w-[424px] mds:w-[332px] mds:h-[350px] h-[240px] rounded-[20px] mds:bg-about bg-guarantee bg-cover">
                        <h2 className="text-[#161616] md:text-[27px] text-[18px] md:leading-[33px] leading-[22px] font-semibold">Полная
                            гарантия</h2>
                        <p className="md:text-[16px] text-[14px] md:leading-6 leading-4 text-[#333438]">Мы предоставляем
                            полную<br/> гарантию на все товары, чтобы<br/> вы могли быть уверены в их<br/> качестве.</p>
                    </div>
                    <div
                        className="flex flex-col justify-end gap-4 p-8 flex-1 md:h-[460px] mds:h-[350px] h-[240px] bg-windows bg-cover rounded-[24px]">
                        <h2 className="text-[#FFFFFF] md:text-[27px] text-[18px] md:leading-[33px] leading-[22px] font-semibold">Долгий
                            опыт<br/>
                            на рынке</h2>
                        <p className="md:text-[16px] text-[14px] md:leading-6 leading-4 text-[#CACDDC]">LoftSoft
                            работает на рынке уже<br/> более 2 лет, что гарантирует<br/> надежность и доверие наших<br/>
                            клиентов.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}