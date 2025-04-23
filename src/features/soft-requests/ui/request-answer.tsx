import {CrossLogo} from "@/shared/icons";
import {FC} from "react";

interface Props {
    setIsOpen: (a: boolean) => void;
}

export const RequestAnswer:FC<Props> = ({setIsOpen}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-7 w-[500px] py-10 px-6 bg-white rounded-[16px]">
            <div className="flex items-center w-full justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Ответ на заявку #1</h3>
                <div onClick={() => setIsOpen(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer"/>
                </div>
            </div>


                <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
          <textarea
              className="bg-transparent w-full h-[200px] outline-0 text-[#161616]"
              placeholder="Напишите ответ"
          />
                </div>
        </div>
    )
}
