interface Props{
    title: string,
    description?: string,
}

export const TitleDesc:React.FC<Props> = ({title, description}) => {
    return (
        <div className="flex flex-col items-center gap-[10px]">
            <h2 className="text-[40px] font-medium leading-[50px] text-[#161616]">{title}</h2>
            <p className="text-[16px] leading-[23px] text-[#6A6B75]">{description}</p>
        </div>
    )
}