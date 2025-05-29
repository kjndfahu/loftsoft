import Link from "next/link";

export const Rules  = () => {
    return (
        <div className="flex flex-col gap-2 pt-4">
            <Link href="/privacy-policy">
                <p className="text-[14px] text-[#161616] font-medium leading-4">Политика конфиденциальности</p>
            </Link>
            <Link href="/privacy-policy">
                <p className="text-[14px] text-[#161616] font-medium leading-4">Пользовательское соглашение</p>
            </Link>
            <Link href="/privacy-policy">
                <p className="text-[14px] text-[#161616] font-medium leading-4">Оферта</p>
            </Link>
        </div>
    )
}