"use client"

import { useEffect, useRef, useState } from "react"
import {SectionsBar} from "@/features/privacy-policy/ui/sections-bar";
import {Texts} from "@/features/privacy-policy/ui/texts";
import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {Profile} from "@/features/profile/container/profile";

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100

            let currentSection = null
            Object.keys(sectionRefs.current).forEach((id) => {
                const element = sectionRefs.current[id]
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        currentSection = id
                    }
                }
            })

            if (currentSection !== activeSection) {
                setActiveSection(currentSection)
            }
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [activeSection])

    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title="Профиль"/>
            <div className="flex min-h-screen">
                <SectionsBar activeSection={activeSection} sectionRefs={sectionRefs}
                             setActiveSection={setActiveSection}/>
                <Texts sectionRefs={sectionRefs}/>
            </div>
        </div>
    )
}
