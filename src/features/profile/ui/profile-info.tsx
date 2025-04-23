import {Button} from "@/shared/button";
import {BackBtn} from "@/shared/icons";

export const ProfileInfo = ({email}:{email?: string}) => {
    return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-[66px] h-[66px] rounded-[12px] bg-[#F5F7FF]"/>
                    <h5 className="text-[20px] text-[#161616]">{email}</h5>
                </div>
                <Button text="Выйти" logo={ <BackBtn/> }/>
            </div>
    )
}