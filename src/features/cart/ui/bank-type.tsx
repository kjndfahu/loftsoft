interface Props{
    className?:string,
    logo?:React.ReactNode
}

export const BankType:React.FC<Props> = ({className, logo}) => {
    return (
        <div className={`flex ${className} items-center justify-center rounded-full w-[34px] h-[34px]`}>
            {logo}
        </div>
    )
}