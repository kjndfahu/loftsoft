'use client'
import {Navbar} from "@/features/header/ui/navbar";
import {Help} from "@/features/header/ui/help";
import {useState} from "react";
import {HelpModal} from "@/features/header/ui/help-popup";

export const Top = () => {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <div className="mds:flex hidden items-center justify-between pt-4 pb-[11px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] bg-[#F5F7FF]">
            <Navbar/>
            <div onClick={()=>setIsClicked(true)}>
                <Help/>
            </div>
            {isClicked && (
                <HelpModal setIsClicked={setIsClicked}/>
            )}
        </div>
    )
}