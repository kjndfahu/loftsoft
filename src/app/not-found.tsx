import Link from "next/link";
import Image from 'next/image'


export default function NotFoundPage() {
    return (
        <div className="flex flex-col relative pt-[200px] pb-[487px] gap-14 px-[250px]">
            <h2 className="text-[96px] leading-[96px] font-semibold text-[#CACDDC]">Страница<br/>
                <span className="text-[#5069E8]">не найдена</span>
            </h2>
            <div className="flex gap-[10px]">
                    <Link href="/catalog">
                    <button className="text-[16px] text-white font-semibold rounded-full px-6 py-3 bg-[#5069E8]">Перейти
                        в
                        каталог
                    </button>
                </Link>
                <Link href="/public">
                    <button
                        className="text-[16px] text-[#161616] font-semibold rounded-full px-6 py-3 border-[1px] border-[#CACDDC]">На
                        главную
                    </button>
                </Link>
            </div>

            <Image src="https://i.imgur.com/KUqia6r.png" className="absolute right-[172px] bottom-[-100px]" alt="box2"/>
            <Image src="https://i.imgur.com/UBRZ8fq.png" className="absolute left-[250px] bottom-[-100px]" alt="box"/>
            <Image src="https://i.imgur.com/YtNEXLq.png" className="absolute right-[181px] top-[270px]" alt="box3"/>
        </div>
    );
}