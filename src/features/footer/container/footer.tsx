import {FooterMain} from "@/features/footer/ui/footer-main";
import {FooterLinks} from "@/features/footer/ui/footer-links";
import {ShapeFooter} from "@/shared/icons";
import {Bottom} from "@/features/footer/ui/bottom";

export const Footer = () => {
    return (
        <div className="flex flex-col mt-[80px] relative bg-footer z-[2]">
            <div className="flex pt-[94px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] px-[50px] gap-[98px] pb-[150px]">
                <FooterMain/>
                <FooterLinks/>
                <ShapeFooter className="absolute xxl:w-[626px] w-[500px] xxl:h-[386px] h-[280px] top-0 right-0 z-[1]"/>
            </div>
            <Bottom/>
        </div>
    )
}