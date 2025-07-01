import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SearchBar } from "@/features/header/ui/search-bar"
import { CatalogBtn } from "@/features/header/ui/catalog-btn"

export const SearchBlock = () => {
    const [opened, setOpened] = useState<"catalog" | "search" | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        setOpened(null)
    }, [pathname])

    return (
        <div className="mds:flex hidden items-center md:gap-3 gap-1.5">
            <CatalogBtn
                isOpen={opened === "catalog"}
                onOpen={() => setOpened("catalog")}
                onClose={() => setOpened(null)}
            />
            <SearchBar
                categories={[]}
                isOpen={opened === "search"}
                onOpen={() => setOpened("search")}
                onClose={() => setOpened(null)}
            />
        </div>
    )
}