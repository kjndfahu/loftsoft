import {Navbar} from "@/features/header/ui/navbar";
import {Help} from "@/features/header/ui/help";

export const Top = () => {
    return (
        <div className="flex  items-center justify-between pt-4 pb-[11px] px-[250px] bg-[#F5F7FF]">
            <Navbar/>
            <Help/>
        </div>
    )
}