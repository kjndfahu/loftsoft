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
        <div className="flex mds:flex-row flex-col mds:gap-0 gap-6 items-center justify-between">
            <Button className="mds:w-auto w-full justify-center" onClick={() => setIsClicked(true)} text="Сменить пароль" />
            <div
                onClick={() => setIsDelete(true)}
                className="flex cursor-pointer text-[16px] text-[#161616] mds:gap-2 gap-1 items-center"
            >
                <CrossLogo />
                Удалить аккаунт
            </div>
            {isClicked && <Modal setModalOpen={setIsClicked} form={<ChangePasswordForm setIsClicked={setIsClicked} />} />}
            {isDelete && <Modal setModalOpen={setIsDelete} form={<DeleteAccountForm setIsDelete={setIsDelete} />} />}
        </div>
    )
}
