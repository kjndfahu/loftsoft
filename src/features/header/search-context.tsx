import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
    isSearchOpen: boolean;
    setIsSearchOpen: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <SearchContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};