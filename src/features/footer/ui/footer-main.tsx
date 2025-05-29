"use client"

import { useCallback, useState } from "react"
import { Modal } from "@/shared/modal"
import { LoginForm } from "@/features/auth/container/login-form"
import { SignUpForm } from "@/features/auth/container/sign-up-form"
import { RestorePasswordForm } from "@/features/auth/container/restore-password-form"
import { useUser } from "@/enteties/auth/use-user"
import { useRouter } from "next/navigation"
import Link from "next/link";

export const FooterMain = () => {
    const { user } = useUser()
    const router = useRouter()
    const [isAuth, setIsAuth] = useState(false)
    const [isRegistration, setIsRegistration] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)

    const handleRegistrationClick = useCallback(() => {
        setIsAuth(false)
        setForgotPassword(false)
        setIsRegistration(true)
    }, [])

    const handleLoginClick = useCallback(() => {
        if (user) {
            router.push("/profile")
        } else {
            setIsRegistration(false)
            setForgotPassword(false)
            setIsAuth(true)
        }
    }, [user, router])

    const handleRestoreClick = useCallback(() => {
        setIsRegistration(false)
        setIsAuth(false)
        setForgotPassword(true)
    }, [])

    console.log(user)

    return (
        <div className="flex flex-col mds:items-start items-center mds:gap-[33px] gap-[14px]">
            <div className="flex flex-col mds:items-start items-center text-white gap-[6px]">
                <h4 className="text-[27px] font-semibold leading-[33px]">LOFT SOFT</h4>
                <p className="text-[14px] font-medium leading-[19px]">Покупайте ключи выгодно.</p>
            </div>
            <button
                className="py-[10px] font-semibold w-[84px] text-[#161616] text-[16px] bg-white rounded-full"
                onClick={handleLoginClick}
            >
                Войти
            </button>
            {user?.role === "ADMIN" && (
                <Link href="/admin-main">
                    <button
                        className="py-[5px] font-semibold w-[100px] text-[#161616] text-[16px] bg-white rounded-full"
                    >
                        Админка
                    </button>
                </Link>
            )}
            {isAuth && (
                <Modal
                    form={
                        <LoginForm
                            handleRegistrationClick={handleRegistrationClick}
                            handleRestoreClick={handleRestoreClick}
                            setIsAuth={setIsAuth}
                        />
                    }
                />
            )}
            {isRegistration && (
                <Modal
                    form={<SignUpForm handleLoginClick={handleLoginClick} setIsRegistration={setIsRegistration}/>}
                />
            )}
            {forgotPassword && (
                <Modal
                    form={<RestorePasswordForm handleLoginClick={handleLoginClick}
                                               setForgotPassword={setForgotPassword}/>}
                />
            )}
        </div>
    )
}