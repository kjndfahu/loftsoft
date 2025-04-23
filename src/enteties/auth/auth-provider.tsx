"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, logout } from "./auth-actions"

type User = { email: string } | null

interface AuthContextType {
    user: User
    isLoading: boolean
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getCurrentUser()
                setUser(currentUser)
            } catch (error) {
                console.error("Ошибка при загрузке пользователя:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    return <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
