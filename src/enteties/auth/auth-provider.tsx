"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { getCurrentUser } from "@/enteties/auth/auth-actions";
import { ROLE } from "@/kernel/types";

interface User {
    id: number;
    email: string;
    role: ROLE;
    referralCode: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser || null);
        } catch (error) {
            console.error("Ошибка при загрузке пользователя:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setUser(null);
        setIsLoading(false);
    }, []);

    // Fetch user on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            user,
            isLoading,
            refreshUser,
            handleLogout,
        }),
        [user, isLoading, refreshUser, handleLogout]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}