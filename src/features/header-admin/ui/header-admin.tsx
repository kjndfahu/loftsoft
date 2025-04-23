import Link from "next/link";
import {MainLogo} from "@/shared/icons";

export const HeaderAdmin = () => {
    return (
        <header className="flex w-full z-[100] fixed flex-col">
            <div className="flex text-black text-[25px] font-bold items-center justify-between bg-white pt-[20px] pb-[27px] px-[250px]">
                <Link href="/">
                    <MainLogo/>
                </Link>
                Админ Панель
            </div>
        </header>
    )
}