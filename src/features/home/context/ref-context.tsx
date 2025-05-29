"use client";

import React, { createContext, useContext, useEffect } from "react";
import Cookies from "js-cookie";

interface RefContextType {
    refCode: string | null;
}

const RefContext = createContext<RefContextType>({ refCode: null });

export const RefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const refCode = Cookies.get("ref") || null;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("ref");

        if (ref && ref !== refCode) {
            Cookies.set("ref", ref, { expires: 30 });
        }
    }, []);

    return (
        <RefContext.Provider value={{ refCode }}>
            {children}
        </RefContext.Provider>
    );
};

export const useRef = () => useContext(RefContext);