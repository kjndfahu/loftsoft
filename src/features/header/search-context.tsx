import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface SearchContextType {
    isSearchOpen: boolean;
    setIsSearchOpen: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const contextValue = useMemo(
        () => ({
            isSearchOpen,
            setIsSearchOpen,
        }),
        [isSearchOpen]
    );

    return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};