export const NavBtn = ({text}:{text:string}) => {
    return (
        <button className="flex sm:w-auto w-full font-semibold items-center justify-center text-[16px] rounded-full text-[#161616] py-[10px] sm:px-[18px] border-[1px] border-[#DBDEEF]">
            {text}
        </button>
    )
}