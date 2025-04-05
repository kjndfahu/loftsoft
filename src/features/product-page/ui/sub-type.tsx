'use client'

import {useState} from "react";

export const SubType = () => {
    const [activeCategory, setActiveCategory] = useState("key")
    return (
        <div className="flex flex-col bg-[#F5F7FF] rounded-[20px] gap-[12px] p-6">
            <h4 className="text-[16px] font-semibold text-[#161616]">Вид подписки</h4>
            <div className="flex gap-[6px]">
                <button
                    onClick={() => setActiveCategory('key')}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${activeCategory === 'key' ? `border-[#5069E8]` : ` border-[#DBDEEF]`}`}>
                    <span>Ключ</span>
                </button>

                <button
                    onClick={() => setActiveCategory('account')}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors text-black border-[1px] ${activeCategory === 'account' ? `border-[#5069E8]` : ` border-[#DBDEEF]`}`}>
                    <span>Акаунт</span>
                </button>
            </div>
            <p className="text-[12px] text-[#4E4F56]">После покупки будет выдан ключ</p>
        </div>
    )
}