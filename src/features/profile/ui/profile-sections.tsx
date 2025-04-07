import {BoxLogo, UserLogo} from "@/shared/icons";

export const ProfileSections = ({tab, setTab}:{tab: string, setTab: (tab: string) => void}) => {
    return (
        <div className="flex h-full w-[312px] flex-col gap-[12px] rounded-[16px] border-[1px] border-[#E9EBF6] p-3">
            <p className="text-[13px] text-[#4E4F56]">Разделы</p>
            <div className="flex flex-col">
                <div onClick={() => setTab('profile')} className={`flex items-center cursor-pointer ${tab === 'profile' ? 'bg-[#F5F7FF] border-r-[4px] border-[#5069E8]' : 'bg-white'} gap-[6px] rounded-[8px] py-[11px] px-[16px]`}>
                    <UserLogo/>
                    <h4 className={`${tab === 'profile' ? 'text-[#5069E8]' : 'text-[#161616]'} text-[14px]`}>Профиль</h4>
                </div>
                <div onClick={() => setTab('orders')} className={`flex items-center cursor-pointer ${tab === 'orders' ? 'bg-[#F5F7FF] border-r-[4px] border-[#5069E8]' : 'bg-white'} gap-[6px] rounded-[8px] py-[11px] px-[16px]`}>
                    <BoxLogo/>
                    <h4 className={`${tab === 'orders' ? 'text-[#5069E8]' : 'text-[#161616]'} text-[14px]`}>Заказы</h4>
                </div>
            </div>
        </div>
    )
}