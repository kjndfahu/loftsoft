"use client"

import Image from 'next/image'
import { useRef, useState, useEffect, type MouseEvent } from 'react'

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
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const handleMouseDown = (e: MouseEvent) => {
        if (!scrollContainerRef.current) return

        setIsDragging(true)
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
        setScrollLeft(scrollContainerRef.current.scrollLeft)
        document.body.style.cursor = "grabbing"
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return

        const x = e.pageX - scrollContainerRef.current.offsetLeft
        const walk = (x - startX) * 2 // Adjust scroll speed
        scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        document.body.style.cursor = "default"
    }

    useEffect(() => {
        const handleMouseLeave = () => {
            setIsDragging(false)
            document.body.style.cursor = "default"
        }

        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("mouseleave", handleMouseLeave)
            document.body.style.cursor = "default"
        }
    }, [])

    return (
        <>
            <style jsx>{scrollbarHideStyles}</style>
            <div
                ref={scrollContainerRef}
                className="flex sml:flex-wrap overflow-x-auto gap-[10px] sml:w-full scrollbar-hide sml:mx-0 -mx-4 sml:px-0 px-4 sml:cursor-auto cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <button
                    onClick={(e) => {
                        if (!isDragging) onChange("all")
                        else e.preventDefault()
                    }}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 ${
                        activeTab === "all" ? `bg-[#5069E8] text-white` : `bg-[#F5F7FF] text-black`
                    }`}
                >
                    <span>Все</span>
                </button>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={(e) => {
                            if (!isDragging) onChange(tab.title)
                            else e.preventDefault()
                        }}
                        className={`flex items-center overflow-hidden gap-2 rounded-full text-sm font-medium transition-colors pr-4 flex-shrink-0 ${
                            activeTab === tab.title ? `bg-[#5069E8] text-white` : `bg-[#F5F7FF] text-black`
                        }`}
                    >
                        <Image className="mt-[12px]" height={64} width={64} alt="tab" src={tab.photo || "/placeholder.svg"} />
                        <span>{tab.title}</span>
                    </button>
                ))}
            </div>
        </>
    )
}