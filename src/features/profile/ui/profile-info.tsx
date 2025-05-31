"use client";

import { Button } from "@/shared/button";
import { BackBtn } from "@/shared/icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/enteties/auth/auth-actions";

export const ProfileInfo = ({ email, handleLogout }: { email?: string; handleLogout: () => void }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogoutClick = () => {
        startTransition(async () => {
            try {
                await logout();
                handleLogout();
                router.push("/");
            } catch (error) {
                console.error("Ошибка при выходе:", error);
            }
        });
    };

    const firstLetter = email ? email.charAt(0).toUpperCase() : 'X';

    return (
        <div className="flex mds:gap-0 gap-4 mds:flex-row flex-col mds:items-center justify-between">
            <div className="flex items-center mds:gap-6 gap-4">
                <div className="flex items-center justify-center text-black font-semibold text-[27px] mds:w-[66px] w-[40px] mds:h-[66px] h-[40px] mds:rounded-[12px] rounded-[9px] bg-[#F5F7FF]">
                    {firstLetter}
                </div>
                <h5 className="text-[20px] text-[#161616]">{email}</h5>
            </div>
            <Button
                className="mds:w-auto w-full justify-center"
                text="Выйти"
                logo={<BackBtn />}
                onClick={handleLogoutClick}
            />
        </div>
    );
};