"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useCartStore } from "../../../../store/use-cart-store"; // Import the cart store
import mainSphere from "../../../../public/img/main-sphere.avif";
import mainSphere2 from "../../../../public/img/main-sphere.png";
import sphere2 from "../../../../public/img/sphere-2.avif";
import sphere3 from "../../../../public/img/sphere-3.avif";

export default function SuccessfulPaymentPage() {
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        const timer = setTimeout(() => {
            clearCart();
        }, 500);

        return () => clearTimeout(timer);
    }, [clearCart]);

    return (
        <div className="flex flex-col overflow-y-hidden sm:overflow-x-visible overflow-x-hidden relative mds:pt-[200px] pt-[75px] lg:pb-[487px] md:pb-[340px] pb-[200px] mds:gap-8 gap-6 xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px]">
            <div className="flex flex-col gap-4">
                <h2 className="mds:text-[64px] text-[32px] mds:leading-[70px] leading-[36px] font-semibold text-[#161616]">
                    Успешная
                    <br />
                    оплата!
                </h2>
                <p className="mds:text-[16px] text-[14px] leading-5 text-[#4E4F56]">
                    Чтобы получить оплаченный заказ,
                    <br />
                    пожалуйста, заполните необходимые на
                    <br />
                    странице «заказы».
                </p>
            </div>
            <div className="flex gap-[10px]">
                <Link href="/orders">
                    <button className="text-[16px] text-white font-semibold rounded-full px-6 py-3 bg-[#5069E8]">
                        Перейти в заказы
                    </button>
                </Link>
            </div>
            <Image
                alt="mainSphere"
                src={mainSphere}
                className="sml:flex hidden absolute z-[2] aspect-902/696 lg:w-[902px] md:w-[700px] mds:w-[500px] w-[450px] xxl:right-[172px] lg:right-[70px] mds:right-[40px] right-[20px] bottom-[-100px]"
            />
            <Image
                alt="mainSphere"
                src={mainSphere2}
                className="sml:hidden flex overflow-hidden absolute z-[2] aspect-902/696 s:w-[276px] w-[200px] xxl:right-[172px] lg:right-[70px] mds:right-[40px] sm:right-[10px] s:right-[-100px] right-[-60px] s:bottom-[10px] bottom-[50px]"
            />
            <Image
                alt="sphere2"
                src={sphere2}
                className="absolute aspect-294/285 md:w-[294px] mds:w-[200px] w-[140px] z-[1] xxl:left-[350px] xl:left-[150px] lg:left-[70px] left-[30px] md:bottom-[-50px] bottom-[-10px]"
            />
            <Image
                alt="sphere3"
                src={sphere3}
                className="absolute sml:w-[174px] w-[100px] z-[1] md:left-[40%] sm:left-[50%] left-[60%] mds:top-[170px] sm:top-[100px] top-[70px]"
            />
        </div>
    );
}