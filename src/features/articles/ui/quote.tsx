import {FC} from "react";

interface Props{
    text: string
}

export const Quote:FC<Props> = ({text}) => {
    return (
        <div
            className="relative bg-[#FFFBF4] border-l-[2px] border-[#E3A407] px-5 py-4 mb-6 rounded-lg"
        >
            <p className="text-[#A06900] sml:text-[16px] text-[14px] font-normal leading-relaxed">
                {text}
            </p>
        </div>
    )
}