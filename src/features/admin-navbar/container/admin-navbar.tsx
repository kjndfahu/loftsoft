import {AdminBtn} from "@/features/admin-navbar/ui/admin-btn";
import {
    BanknoteArrowDown,
    ChartColumnStacked, FileQuestion,
    FolderCode,
    Home,
    ListOrdered,
    Newspaper,
    ShoppingBasket,
    Star, StretchHorizontal
} from "lucide-react";
import Link from "next/link";

export const AdminNavbar = () => {
    return (
        <div className="flex flex-col min-h-screen fixed mds:left-[50px] sml:left-[30px] left-[10px] w-auto mds:pt-[120px] pt-[90px] items-center gap-5">
            <Link href="/admin-main">
                <AdminBtn title="Главная" logo={ <Home color="#000000"/> }/>
            </Link>

            <Link href="/create-category">
                <AdminBtn title="Создать категорию" logo={ <ChartColumnStacked color="#000000"/> }/>
            </Link>
            <Link href="/create-product">
                <AdminBtn title="Создать товар" logo={ <ShoppingBasket color="#000000"/> }/>
            </Link>
            <Link href="/withdraw-requests">
                <AdminBtn title="Заявки на вывод" logo={ <BanknoteArrowDown color="#000000"/> }/>
            </Link>
            <Link href="/admin-reviews">
                <AdminBtn title="Отзывы" logo={ <Star color="#000000"/> }/>
            </Link>
            <Link href="/soft-requests">
                <AdminBtn title="Заявки по софту" logo={ <FolderCode color="#000000"/> }/>
            </Link>
            <Link href="/admin-articles">
                <AdminBtn title="Статьи" logo={ <Newspaper color="#000000"/> }/>
            </Link>
            <Link href="/admin-orders">
                <AdminBtn title="Заказы" logo={ <ListOrdered color="#000000"/> }/>
            </Link>
            <Link href="/popular-products">
                <AdminBtn title="Популярные товары" logo={ <StretchHorizontal color="#000000"/> }/>
            </Link>
            <Link href="/admin-knowledge-base">
                <AdminBtn title="Ответы на вопросы" logo={ <FileQuestion  color="#000000"/> }/>
            </Link>
        </div>
    )
}