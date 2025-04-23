interface Props{
    title: string,
    description?: string,
}

export const TitleDesc:React.FC<Props> = ({title, description}) => {
    return (
        <div className="flex flex-col items-center gap-[10px]">
            <h2 className="sml:text-[40px] text-[22px] font-medium sml:leading-[50px] leading-[25px] text-[#161616]">{title}</h2>
            <p className="text-[16px] leading-[23px] text-[#6A6B75]">{description}</p>
        </div>
    )
}