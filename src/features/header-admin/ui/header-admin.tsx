import Link from "next/link";
import {MainLogo} from "@/shared/icons";

export const HeaderAdmin = () => {
    return (
        <header className="flex w-full z-[100] fixed flex-col">
            <div className="flex text-black mds:text-[25px] text-[18px] font-bold items-center justify-between bg-white pt-[20px] pb-[27px] sml:px-[50px] px-[20px]">
                <Link href="/">
                    <MainLogo/>
                </Link>
                Админ Панель
            </div>
        </header>
    )
}