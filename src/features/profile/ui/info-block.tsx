import {InfoGlass} from "@/shared/catalog-images";
import {ReviewStar} from "@/shared/icons";

export const InfoBlock = () => {
    return (
        <div className="flex flex-col items-center gap-4 pt-16 pb-10 relative info rounded-[36px] w-full h-[390px]">
            <h2 className="text-[48px] text-center leading-[55px] text-white font-medium">Нам доверяют более 3000 <span className="text-[#CED7FF]">человек<br/>
                каждый месяц, будь в их числе</span> </h2>
            <p className="text-[16px] leading-[20px] text-center text-[#FFFFFFCC]">В этом разделе вы найдёте отзывы наших клиентов и ссылки на популярные<br/> сервисы для ознакомления с дополнительными отзывами</p>
            <div className="flex pt-6 gap-4">
                <div className="flex border-[1px] bg-[#FFFFFF0F] rounded-[16px] border-[#FFFFFF40] items-center py-3 px-6 gap-2">
                    <div className="w-[40px] h-[40px] rounded-[12px] bg-red-500"/>
                    <div className="flex flex-col ">
                        <h5 className="text-[16px] leading-5 font-medium">Яндекс</h5>
                        <div className="flex items-center gap-1">
                            <ReviewStar/>
                            <p className="text-[10px] leading-[14px] text-white">5.0 | 2350 отзывов</p>
                        </div>
                    </div>
                </div>

                <div className="flex border-[1px] bg-[#FFFFFF0F] rounded-[16px] border-[#FFFFFF40] items-center py-3 px-6 gap-2">
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

            <InfoGlass className="absolute top-0 left-0 rounded-l-[36px]"/>
            <InfoGlass className="absolute -scale-x-100 top-0 right-0 rounded-r-[36px]"/>
        </div>
    )
}