import "../globals.css";
import { Header } from "@/features/header/container/header";
import { Footer } from "@/features/footer/container/footer";
import { RefProvider } from "@/features/home/context/ref-context";
import Script from "next/script";

export default function MainLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RefProvider>
            <Header />
            {children}
            <Footer />
            <Script
                id="supportScript"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (function(){(function c(d,w,m,i) {
              window.supportAPIMethod = m;
              var s = d.createElement('script');
              s.id = 'supportScript'; 
              var id = '52f1e91e2b38bd0bd920d022ed8ef48b';
              s.src = (!i ? 'https://admin.verbox.ru/support/support.js' : 'https://static.site-chat.me/support/support.int.js') + '?h=' + id;
              s.onerror = i ? undefined : function(){c(d,w,m,true)};
              w[m] = w[m] ? w[m] : function(){(w[m].q = w[m].q ? w[m].q : []).push(arguments);};
              (d.head ? d.head : d.body).appendChild(s);
            })(document,window,'Verbox')})();
          `,
                }}
            />
        </RefProvider>
    );
}