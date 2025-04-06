import Link from "next/link";

export const Navbar = () => {
    return (
        <div className="flex text-[16px] text-[#4E4F56] gap-8">
            <Link href="/about-us"><p className="cursor-pointer">О магазине</p></Link>
            <Link href="/reviews"><p className="cursor-pointer">Отзывы</p></Link>
            <Link href="/articles"><p className="cursor-pointer">Статьи</p></Link>
            <Link href="/answers"><p className="cursor-pointer">Ответы на вопросы</p></Link>
        </div>
    )
}