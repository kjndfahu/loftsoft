import {FooterMain} from "@/features/footer/ui/footer-main";
import {FooterLinks} from "@/features/footer/ui/footer-links";
import Image from 'next/image'
import shapeFooter from '../../../../public/img/shape-footer.png'
import {Bottom} from "@/features/footer/ui/bottom";

export const Footer = () => {
    return (
        <div className="flex flex-col mds:rounded-t-[0px] rounded-t-[24px] relative overflow-hidden bg-footer z-[2]">
            <div className="flex mds:flex-row flex-col mds:items-start items-center pt-[94px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sm:px-[50px] px-[23px] lg:gap-[98px] gap-12 pb-[150px]">
                <FooterMain/>
                <FooterLinks/>
                <Image alt="shapeFooter" src={shapeFooter} className="absolute mds:rotate-[-120deg] rotate-[-10deg] z-[1] mix-blend-luminosity aspect-626/386 xxl:w-[626px] lg:w-[500px] md:w-[420px] sml:w-[350px] w-[300px] mds:bottom-auto sml:bottom-[-70px] bottom-[-70px] xxl:top-[-250px] mds:top-[-170px] top-auto mds:right-[-70px] sml:right-[-67px] right-[-57px]"/>
            </div>
            <Bottom/>
        </div>
    )
}