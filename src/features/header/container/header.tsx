import {Top} from "@/features/header/ui/top";
import {UserBar} from "@/features/header/ui/user-bar";

export const Header = () => {
    return (
        <header className="flex w-full z-[100] fixed flex-col">
            <Top/>
            <UserBar/>
        </header>
    )
}