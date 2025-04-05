import {DistributiveItem} from "@/features/product-page/ui/distributive-item";

export const Distributive = () => {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-[14px] text-[#161616]">Дистрибутив</h4>
            <DistributiveItem/>
            <DistributiveItem/>
        </div>
    )
}