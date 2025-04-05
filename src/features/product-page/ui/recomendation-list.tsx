import {Items} from "@/features/home/ui/item";

export const RecomendationList = () => {
    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-[27px] text-[#161616]">Еще может подойти</h3>
            <div className="flex gap-7">
                <Items/>
                <Items/>
                <Items/>
                <Items/>
            </div>
        </div>
    )
}