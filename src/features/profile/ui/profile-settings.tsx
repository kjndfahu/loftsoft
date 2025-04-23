"use client"

import { Button } from "@/shared/button"
import { CrossLogo } from "@/shared/icons"
import { useState } from "react"
import { Modal } from "@/shared/modal"
import { ChangePasswordForm } from "@/features/profile/ui/change-password-form"
import { DeleteAccountForm } from "@/features/profile/ui/delete-account"

export const ProfileSettings = () => {
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [isDelete, setIsDelete] = useState<boolean>(false)

    return (
        <div className="flex items-center justify-between">
            <Button onClick={() => setIsClicked(true)} text="Сменить пароль" />
            <div
                onClick={() => setIsDelete(true)}
                className="flex cursor-pointer text-[16px] text-[#161616] gap-2 items-center"
            >
                <CrossLogo />
                Удалить аккаунт
            </div>
            {isClicked && <Modal form={<ChangePasswordForm setIsClicked={setIsClicked} />} />}
            {isDelete && <Modal form={<DeleteAccountForm setIsDelete={setIsDelete} />} />}
        </div>
    )
}
