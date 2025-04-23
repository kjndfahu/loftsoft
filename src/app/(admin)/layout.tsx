import "../globals.css";
import {HeaderAdmin} from "@/features/header-admin/ui/header-admin";
import {AdminNavbar} from "@/features/admin-navbar/container/admin-navbar";

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`flex h-screen flex-col items-center bg-cover bg-auth w-full sml:px-0 px-[20px]`}>
            <HeaderAdmin/>
            <div className="flex w-full">
                <AdminNavbar/>
                {children}
            </div>
        </div>
    );
}