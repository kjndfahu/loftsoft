import {SearchLogo} from "@/shared/icons";

export const SearchBar = () => {
    return (
        <div className="flex items-center justify-between w-[666px] border-[1px] border-[#DBDEEF] text-[16px] rounded-full py-3 px-6">
            <input placeholder="Искать тут.." className="text-[#4E4F56] w-full outline-0" type="text"/>
            <SearchLogo/>
        </div>
    )
}