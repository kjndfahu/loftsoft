import {FC, ReactNode} from "react";

interface Props{
    logo: ReactNode
    title: string
}

export const AdminBtn:FC<Props> = ({logo, title}) => {
    return (
        <div className="flex items-center justify-center gap-3 text-black cursor-pointer mds:w-[260px] w-[55px] h-[55px] font-medium text-[18px] border-[2px] border-[#000000] rounded-[16px]">
            <div
                className="flex items-center justify-center">
                {logo}
            </div>
            <p className="hidden mds:flex">{title}</p>
        </div>
    )
}