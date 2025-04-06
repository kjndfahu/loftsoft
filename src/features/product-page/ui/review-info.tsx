import {ReviewStar} from "@/shared/icons";

export const ReviewInfo = () => {
    return (
        <div className="flex w-[65%] flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                    <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                    <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                    <ReviewStar className="w-[14px] h-[14px]" color="#FFAC33"/>
                    <ReviewStar className="w-[14px] h-[14px]" color="#CECDCC"/>
                </div>
                <p className="text-[16px] text-[#4E4F56]">16.12.2024</p>
            </div>
            <p className="text-[16px] text-[#333438]">Всё работает отлично. Жаль только, что Майкрософт за меня решает
                как назвать папку юзера. Пришлось создать другой локальный аккаунт на компьютере и удалять тот, что
                Windows сделал при инсталляции. Пляски с бубном.</p>
            <div className="flex gap-4">
                <div style={{aspectRatio: 1 / 1}} className="w-[64px] h-[64px] bg-gray-400 rounded-[12px]"/>
                <div style={{aspectRatio: 1 / 1}} className="w-[64px] h-[64px] bg-gray-400 rounded-[12px]"/>
                <div style={{aspectRatio: 1 / 1}} className="w-[64px] h-[64px] bg-gray-400 rounded-[12px]"/>
                <div style={{aspectRatio: 1 / 1}} className="w-[64px] h-[64px] bg-gray-400 rounded-[12px]"/>
                <div style={{aspectRatio: 1 / 1}} className="w-[64px] h-[64px] bg-gray-400 rounded-[12px]"/>
            </div>
        </div>
    )
}