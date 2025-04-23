export const ArticleBlock = () => {
    return (
        <div style={{aspectRatio: 424/470}} className="flex flex-col gap-4 border-[1px] border-[#DBDEEF] w-full rounded-[14px]">
            <div style={{aspectRatio: 424/283}} className="w-full bg-gray-400 rounded-[14px]"/>
            <div className="flex flex-col md:gap-5 gap-[18px] px-[20px] ">
                <p className="text-[12px] font-medium text-[#A4A8BA]">27 сентября, 2022</p>
                <div className="flex flex-col gap-[10px] md:text-[20px] text-[16px] md:leading-[26px] leading-[20px] text-[#161616]">
                    <h3 className="font-semibold">Ознакомиться с системными требованиями для компьютера..</h3>
                    <p className="md:text-[16px] text-[14px] leading-[23px] text-[#4E4F56] truncate">Мир No Man’s Sky — это настоящая<br/> сокровищница для исследователей. Редкие создания, спрятанные среди миллиардов планет, поражают своим видом и поведением.</p>
                </div>
            </div>
        </div>
    )
}