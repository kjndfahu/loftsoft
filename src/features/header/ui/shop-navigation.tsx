"use client"

import { BoxLogo, CartLogo, SearchLogo, UserLogo } from "@/shared/icons"
import Link from "next/link"
import { useState } from "react"
import { Modal } from "@/shared/modal"
import { LoginForm } from "@/features/auth/container/login-form"
import { SignUpForm } from "@/features/auth/container/sign-up-form"
import { useUser } from "@/enteties/auth/use-user"
import { RestorePasswordForm } from "@/features/auth/container/restore-password-form"

export const ShopNavigation = () => {
    const { user } = useUser()
    const [isAuth, setIsAuth] = useState(false)
    const [isRegistration, setIsRegistration] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)

    const handleRegistrationClick = () => {
        setIsAuth(false)
        setForgotPassword(false)
        setIsRegistration(true)
    }

    const handleLoginClick = () => {
        setIsRegistration(false)
        setForgotPassword(false)
        setIsAuth(true)
    }

    const handleRestoreClick = () => {
        setIsRegistration(false)
        setIsAuth(false)
        setForgotPassword(true)
    }

    return (
        <div className="flex items-center md:gap-5 mds:gap-2 gap-5 text-[12px] text-[#858692]">
            <div className="mds:hidden flex items-center cursor-pointer flex-col gap-1">
                <SearchLogo />
            </div>

            {user ? (
                <Link href="/profile">
                    <div className="flex items-center cursor-pointer flex-col gap-1">
                        <UserLogo />
                        <p className="mds:flex hidden">Профиль</p>
                    </div>
                </Link>
            ) : (
                <div onClick={() => setIsAuth(true)} className="flex items-center cursor-pointer flex-col gap-1">
                    <UserLogo />
                    <p className="mds:flex hidden">Войти</p>
                </div>
            )}
            <div className="flex items-center cursor-pointer flex-col gap-1">
                <BoxLogo />
                <p className="mds:flex hidden">Заказы</p>
            </div>
            <Link href="/cart">
                <div className="mds:flex hidden items-center cursor-pointer flex-col gap-1">
                    <CartLogo />
                    <p className="mds:flex hidden">Корзина</p>
                </div>
            </Link>

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
                <Modal form={<SignUpForm handleLoginClick={handleLoginClick} setIsRegistration={setIsRegistration} />} />
            )}

            {forgotPassword && (
                <Modal
                    form={<RestorePasswordForm handleLoginClick={handleLoginClick} setForgotPassword={setForgotPassword} />}
                />
            )}
        </div>
    )
}
