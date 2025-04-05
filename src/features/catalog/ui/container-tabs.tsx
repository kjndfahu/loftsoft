"use client"

export interface CategoryTab {
    id: string
    label: string
}

interface CategoryTabsProps {
    tabs: CategoryTab[]
    activeTab: string
    onChange: (tabId: string) => void
}

export function CategoryTabs({ tabs, activeTab, onChange }: CategoryTabsProps) {
    return (
        <div className="flex flex-wrap gap-[10px] w-[600px]">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? `bg-[#5069E8] text-white` : `bg-[#F5F7FF] text-black`}`} >
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    )
}

