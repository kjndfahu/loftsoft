export const CategoryBlock = ({logo}:{logo:React.ReactNode}) => {
    return (
        <div className="flex flex-col relative rounded-b-[20px] items-center pt-10 bg-[#F5F7FF] w-full h-[321px] rounded-[20px]">
            <div className="flex flex-col gap-[6px]">
                <h2 className="text-[27px] leading-[50px] text-[#161616]">Проектирование</h2>
                <p className="text-[16px] leading-[23px] text-[#6A6B75]">Софт для проектных задач</p>
            </div>
            {logo}
        </div>
    )
}

