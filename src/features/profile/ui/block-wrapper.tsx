interface Props{
    title: string,
    form:React.ReactNode
}

export const BlockWrapper:React.FC<Props> = ({title, form}) => {
    return (
        <div className="flex flex-col h-full w-full gap-4 rounded-[16px] p-6 border-[1px] border-[#E9EBF6]">
            <span className="text-[11px] text-[#B9BCCB]">{title}</span>
            {form}
        </div>
    )
}