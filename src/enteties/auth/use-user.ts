"use client"

import { useEffect, useState, useCallback } from "react"
import { getCurrentUser } from "@/enteties/auth/auth-actions";
import { ROLE } from "@/kernel/types";

export function useUser() {
    const [user, setUser] = useState<{ id: number; email: string; role: ROLE; referralCode: string } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = useCallback(async () => {
        setIsLoading(true)
        try {
            const currentUser = await getCurrentUser()
            setUser(currentUser) // Sets to null if no session
        } catch (error) {
            console.error("Ошибка при загрузке пользователя:", error)
            setUser(null) // Clear user on error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleLogout = useCallback(() => {
        setUser(null) // Immediately clear user state
        setIsLoading(false) // Reset loading state
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    return { user, isLoading, refreshUser, handleLogout }
}