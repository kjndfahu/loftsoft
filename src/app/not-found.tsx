import {Box2NotFound, Box3NotFound, BoxNotFound} from "@/shared/catalog-images";
import Link from "next/link";


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
            <BoxNotFound className="absolute right-[172px] bottom-[-100px]"/>
            <Box2NotFound className="absolute left-[250px] bottom-[-100px]"/>
            <Box3NotFound className="absolute right-[181px] top-[270px]"/>
        </div>
    );
}