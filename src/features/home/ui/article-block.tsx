export const ArticleBlock = () => {
    return (
        <div className="flex flex-col gap-4 border-[1px] border-[#DBDEEF] w-full h-[470px] rounded-[14px]">
            <div className="w-full h-[283px] bg-gray-400 rounded-[14px]"/>
            <div className="flex flex-col gap-5 px-[20px] ">
                <p className="text-[12px] font-medium text-[#A4A8BA]">27 сентября, 2022</p>
                <div className="flex flex-col gap-[10px] text-[20px] leading-[26px] text-[#161616]">
                    <h3 className="font-semibold">Ознакомиться с системными требованиями для компьютера..</h3>
                    <p className="text-[16px] leading-[23px] text-[#4E4F56] truncate">Мир No Man’s Sky — это настоящая<br/> сокровищница для исследователей. Редкие создания, спрятанные среди миллиардов планет, поражают своим видом и поведением.</p>
                </div>
            </div>
        </div>
    )
}