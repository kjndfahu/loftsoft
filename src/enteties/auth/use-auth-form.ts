"use client"

import type React from "react"

import { useState } from "react"
import {login, LoginFormData, register, RegisterFormData} from "@/enteties/auth/auth-actions";


export function useLoginForm(onSuccess: () => void) {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [generalError, setGeneralError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setGeneralError(null)

        const newErrors: { [key: string]: string } = {}
        if (!formData.email) newErrors.email = "Email обязателен"
        if (!formData.password) newErrors.password = "Пароль обязателен"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            const result = await login(formData)
            if (result.success) {
                onSuccess()
            } else {
                setGeneralError(result.error || "Произошла ошибка при входе")
            }
        } catch (error) {
            setGeneralError("Произошла ошибка при входе")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        formData,
        errors,
        isLoading,
        generalError,
        handleChange,
        handleSubmit,
    }
}

export function useRegisterForm(onSuccess: () => void) {
    const [formData, setFormData] = useState<RegisterFormData>({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [generalError, setGeneralError] = useState<string | null>(null)
    const [isAgreed, setIsAgreed] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target

        if (type === "checkbox") {
            setIsAgreed(checked)
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: "" }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setGeneralError(null)

        const newErrors: { [key: string]: string } = {}
        if (!formData.email) newErrors.email = "Email обязателен"
        if (!formData.password) newErrors.password = "Пароль обязателен"
        if (!formData.confirmPassword) newErrors.confirmPassword = "Подтверждение пароля обязательно"
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают"
        }
        if (!isAgreed) {
            newErrors.agreement = "Необходимо согласиться с условиями"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            const result = await register(formData)
            if (result.success) {
                onSuccess()
            } else {
                setGeneralError(result.error || "Произошла ошибка при регистрации")
            }
        } catch (error) {
            setGeneralError("Произошла ошибка при регистрации")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        formData,
        errors,
        isLoading,
        generalError,
        isAgreed,
        handleChange,
        handleSubmit,
    }
}
