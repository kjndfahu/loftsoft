import {Button} from "@/shared/button";
import {CrossLogo} from "@/shared/icons";

export const ProfileSettings = () => {
    return (
        <div className="flex items-center justify-between">
            <Button text="Сменить пароль"/>
            <div className="flex text-[16px] text-[#161616] gap-2 items-center">
                <CrossLogo/>
                Удалить аккаунт
            </div>
        </div>
    )
}