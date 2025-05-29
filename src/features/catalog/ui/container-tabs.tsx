"use client"

import Image from 'next/image'

const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`

export interface CategoryTab {
    id: number;
    photo: string;
    title: string;
    description: string;
    createdAt: Date;
    updateAt: Date;
}

interface CategoryTabsProps {
    tabs: CategoryTab[]
    activeTab: string
    onChange: (tabId: string) => void
}

export function CategoryTabs({ tabs, activeTab, onChange }: CategoryTabsProps) {
    return (
        <>
            <style jsx>{scrollbarHideStyles}</style>
            <div className="flex sml:flex-wrap overflow-x-auto gap-[10px] sml:w-[600px] scrollbar-hide">
                <button
                    onClick={() => onChange("all")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "all" ? `bg-[#5069E8] text-white` : `bg-[#F5F7FF] text-black`}`}
                >
                    <span>Все</span>
                </button>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.title)}
                        className={`flex items-center overflow-hidden gap-2 rounded-full text-sm font-medium transition-colors pr-4 ${activeTab === tab.title ? `bg-[#5069E8] text-white` : `bg-[#F5F7FF] text-black`}`}
                    >
                        <Image className=" mt-[12px]" height={64} width={64} alt="tab" src={tab.photo}/>
                        <span>{tab.title}</span>
                    </button>
                ))}
            </div>
        </>
    )
}
