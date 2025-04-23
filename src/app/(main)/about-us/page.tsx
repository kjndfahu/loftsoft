import {Hero} from "@/features/about-us/ui/hero";
import {Banner} from "@/features/about-us/ui/banner";

export default function AboutUsPage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-[120px]">
            <Hero/>
            <Banner/>
        </div>
    );
}
