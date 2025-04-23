"use client"

import { useEffect, useState } from "react"
import {getCurrentUser} from "@/enteties/auth/auth-actions";
import {Role} from "@prisma/client";


export function useUser() {
    const [user, setUser] = useState<{ id: number; email: string; role: Role; referralCode: string } | null>(null)
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

    return { user, isLoading }
}
