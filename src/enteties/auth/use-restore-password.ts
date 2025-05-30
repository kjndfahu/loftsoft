"use client";

import type React from "react";
import { useState } from "react";
import {restorePassword, RestorePasswordFormData} from "@/enteties/auth/auth-actions";


interface RestorePasswordResult {
    success: boolean;
    error?: string;
}

export function useRestorePasswordForm(onSuccess: () => void) {
    const [formData, setFormData] = useState<RestorePasswordFormData>({ email: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneralError(null);
        setSuccessMessage(null);

        const newErrors: { [key: string]: string } = {};
        if (!formData.email) newErrors.email = "Email обязателен";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const result = await restorePassword(formData);
            if (result.success) {
                setSuccessMessage("Заявка принята");
            } else {
                setGeneralError(result.error || "Произошла ошибка при восстановлении пароля");
            }
        } catch (error) {
            setGeneralError("Произошла ошибка при восстановлении пароля");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        generalError,
        successMessage,
        handleChange,
        handleSubmit,
    };
}