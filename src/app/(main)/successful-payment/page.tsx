import Link from "next/link";
import {Image1, Image2, Image3} from "@/shared/successful-images";


export default function SuccessfulPaymentPage() {
    return (
        <div className="flex flex-col relative pt-[200px] pb-[487px] gap-8 px-[250px]">
            <div className="flex flex-col gap-4">
                <h2 className="text-[64px] leading-[70px] font-semibold text-[#161616]">Успешная<br/>оплата!</h2>
                <p className="text-[16px] leading-5 text-[#4E4F56]">Чтобы получить оплаченный заказ,<br/> пожалуйста, заполните
                    необходимые на<br/>
                    странице «заказы».</p>
            </div>
            <div className="flex gap-[10px]">
                <Link href="/catalog">
                    <button className="text-[16px] text-white font-semibold rounded-full px-6 py-3 bg-[#5069E8]">Перейти в заказы
                    </button>
                </Link>
            </div>
            <Image1 className="absolute right-[172px] bottom-[-100px]"/>
            <Image2 className="absolute left-[350px] bottom-[-50px]"/>
            <Image3 className="absolute left-[40%] top-[170px]"/>
        </div>
    );
}