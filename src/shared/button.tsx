interface Props {
    logo?: React.ReactNode;
    text: string
}

export const Button:React.FC<Props> = ({logo, text}) => {
    return (
        <button className="flex items-center gap-2 rounded-full border-[1px] border-[#DBDEEF] text-[#161616] text-[16px] py-[11px] px-[18px]">
            {logo}
            {text}
        </button>
    )
}