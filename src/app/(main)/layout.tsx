import "../globals.css";
import {Header} from "@/features/header/container/header";
import {Footer} from "@/features/footer/container/footer";

export default function MainLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={` antialiased`}
        >
        <Header/>
        {children}
        <Footer/>
        </body>
        </html>
    );
}
