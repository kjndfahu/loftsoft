import { InfoGlass } from "@/shared/catalog-images";
import {ReviewStar} from "@/shared/icons";

export const InfoBlockMini = () => {
    return (
        <div className="flex flex-col items-center gap-4 py-6 relative info rounded-[16px] w-full h-[157px]">
            <h2 className="text-[20px] text-center leading-[28px] text-white font-medium">Нам доверяют более 3000</h2>
            <div className="flex gap-4">
                <div
                    className="flex border-[1px] bg-[#FFFFFF0F] rounded-[16px] border-[#FFFFFF40] items-center py-3 px-6 gap-2">
                    <div className="w-[40px] h-[40px] rounded-[12px] bg-red-500"/>
                    <div className="flex flex-col ">
                        <h5 className="text-[16px] leading-5 font-medium">Яндекс</h5>
                        <div className="flex items-center gap-1">
                            <ReviewStar/>
                            <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                        </div>
                    </div>
                </div>

                <div
                    className="flex border-[1px] bg-[#FFFFFF0F] rounded-[16px] border-[#FFFFFF40] items-center py-3 px-6 gap-2">
                    <div className="w-[40px] h-[40px] rounded-[12px] bg-red-500"/>
                    <div className="flex flex-col ">
                        <h5 className="text-[16px] leading-5 font-medium">Яндекс</h5>
                        <div className="flex items-center gap-1">
                            <ReviewStar/>
                            <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                        </div>
                    </div>
                </div>
            </div>

            <InfoGlass className="absolute h-[200px] w-[100px] top-[-50px] right-0 rounded-l-[36px]"/>
            <InfoGlass className="absolute h-[200px] w-[100px] top-0 left-0 -scale-x-100 rounded-r-[36px]"/>
        </div>
    )
}