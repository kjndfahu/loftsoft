'use client'

import {CryptoLogo, SbpLogo} from "@/shared/icons";
import {useState} from "react";

export const PayType = () => {
    const [type, setType] = useState("sbp");
    return (
        <div className="flex gap-3">
            <div
                onClick={() => setType("sbp")}
                className={`flex items-center cursor-pointer p-[10px] w-[110px] gap-[6px] rounded-[12px] border-[1px] ${type === 'sbp' ? 'border-[#5069E8]' : 'border-[#CACDDC]'}`}>
                <SbpLogo className="w-[26px] h-[26px]"/>
                <span className="text-[14px] text-[#161616]">СБП</span>
            </div>
            <div
                onClick={() => setType("crypto")}
                className={`flex items-center cursor-pointer p-[10px] w-[132px] gap-[6px] rounded-[12px] border-[1px] ${type === 'crypto' ? 'border-[#5069E8]' : 'border-[#CACDDC]'}`}>
                <CryptoLogo className="w-[26px] h-[26px]"/>
                <span className="text-[14px] text-[#161616]">Крипта</span>
            </div>
        </div>
    )
}