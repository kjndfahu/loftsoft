import {AdminBtn} from "@/features/admin-navbar/ui/admin-btn";
import {
    BanknoteArrowDown,
    ChartColumnStacked,
    FolderCode,
    Home,
    ListOrdered,
    Newspaper,
    ShoppingBasket,
    Star
} from "lucide-react";
import Link from "next/link";

export const AdminNavbar = () => {
    return (
        <div className="flex flex-col min-h-screen fixed left-[50px] w-auto pt-[200px] items-center gap-5">
            <AdminBtn title="Главная" logo={ <Home color="#000000"/> }/>
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
            <Link href="/orders">
                <AdminBtn title="Заказы" logo={ <ListOrdered color="#000000"/> }/>
            </Link>
        </div>
    )
}