"use client";

import { ArrowRight, CrossLogo } from "@/shared/icons";
import { RestorePasswordInputs } from "@/features/auth/ui/restore-password-inputs";
import { GeneralError } from "@/shared/general-error";
import { Loader } from "@/shared/loader";
import { useRestorePasswordForm } from "@/enteties/auth/use-restore-password";
import { RestorePassSuccess } from "@/features/auth/ui/restore-pas-success";
import { useState, useEffect } from "react";

export const RestorePasswordForm = ({
                                        setForgotPassword,
                                        handleLoginClick,
                                    }: {
    setForgotPassword: (arg: boolean) => void;
    handleLoginClick: () => void;
}) => {
    const { formData, errors, isLoading, generalError, successMessage, handleChange, handleSubmit } = useRestorePasswordForm(() => {
        setForgotPassword(false);
    });
    const [showSuccess, setShowSuccess] = useState(false);

    // Watch for successMessage changes to show success state
    useEffect(() => {
        if (successMessage) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setForgotPassword(false);
            }, 2000); // Show success component for 2 seconds
        }
    }, [successMessage, setForgotPassword]);

    // Determine if the button should be disabled
    const isButtonDisabled = !formData.email || isLoading;

    // Handle form submission
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(e); // Success logic is handled in useEffect
    };

    return (
        <div onClick={e => e.stopPropagation()} className="flex items-center justify-center sm:w-[70vw] w-[96vw]">
            <div className="relative sm:w-[360px] w-full bg-white rounded-[16px]">
                {showSuccess ? (
                    <RestorePassSuccess/>
                ) : (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 w-full pt-4 pb-7 px-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[22px] font-bold text-[#161616]">Восстановить пароль</h3>
                            <div onClick={() => setForgotPassword(false)}>
                                <CrossLogo className="w-6 h-6 cursor-pointer"/>
                            </div>
                        </div>

                        <div
                            onClick={handleLoginClick}
                            className="flex font-semibold text-[16px] text-[#161616] gap-2 cursor-pointer"
                        >
                            <ArrowRight className="rotate-180"/>
                            Назад
                        </div>

                        <RestorePasswordInputs
                            formData={formData}
                            errors={errors}
                            generalError={generalError}
                            handleChange={handleChange}
                        />

                        {generalError && !isLoading && (
                            <GeneralError generalError={generalError}/>
                        )}

                        <div className="flex flex-col pt-2 gap-2">
                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className={`text-[16px] h-[42px] font-semibold border-[1px] border-[#DBDEEF] rounded-full ${
                                    isButtonDisabled ? "bg-[#F5F7FF] text-[#999999] opacity-70" : "text-[#ffffff] bg-[#161616]"
                                }`}
                            >
                                Продолжить
                            </button>
                        </div>
                    </form>
                )}

                {isLoading && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[16px]">
                        <Loader/>
                    </div>
                )}
            </div>
        </div>

    );
};