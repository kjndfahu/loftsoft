"use client";

import { BlockWrapper } from "@/features/profile/ui/block-wrapper";
import { ProfileInfo } from "@/features/profile/ui/profile-info";
import { ProfileSettings } from "@/features/profile/ui/profile-settings";
import { RefProgram } from "@/features/profile/ui/ref-program";

import { getUserReferrals } from "@/enteties/referral/referral";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useAuth} from "@/enteties/auth/auth-provider";

interface Referral {
    id: number;
    userId: number;
    percent: number;
    totalCashback: number;
    totalReferrals: number;
}

export const Profile = () => {
    const { user, isLoading, handleLogout } = useAuth();
    const [referral, setReferral] = useState<Referral[] | null>(null);
    const router = useRouter();

    const fetchReferrals = async () => {
        if (!user) return;
        try {
            const referralData = await getUserReferrals(user.id);
            setReferral(referralData);
        } catch (error) {
            console.error("Ошибка при загрузке рефералов:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchReferrals();
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/"); // Redirect to homepage if not authenticated
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex sml:flex-row flex-col mds:gap-6 gap-3">
                <div className="flex flex-col flex-1 gap-6">
                    <div className="animate-pulse w-full rounded-[16px] h-[150px] bg-[#F5F7FF]"></div>
                    <div className="animate-pulse w-full rounded-[16px] h-[410px] bg-[#F5F7FF]"></div>
                    <div className="animate-pulse w-full rounded-[16px] h-[130px] bg-[#F5F7FF]"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Prevent rendering if redirected
    }

    const firstReferral = referral && referral.length > 0 ? referral[0] : null;

    return (
        <div className="flex sml:flex-row flex-col mds:gap-6 gap-3">
            <div className="flex flex-col flex-1 gap-6">
                <BlockWrapper title="О ПРОФИЛЕ" form={<ProfileInfo email={user.email} handleLogout={handleLogout} />} />
                <BlockWrapper
                    title="РЕФЕРАЛЬНАЯ ПРОГРАММА"
                    form={
                        <RefProgram
                            userId={user.id}
                            userEmail={user.email}
                            refCode={user.referralCode}
                            percent={firstReferral?.percent || 0}
                            totalCashback={firstReferral?.totalCashback || 0}
                            totalReferrals={firstReferral?.totalReferrals || 0}
                            availableSum={firstReferral?.totalCashback?.toString() || "0"}
                        />
                    }
                />
                <BlockWrapper title="НАСТРОЙКИ" form={<ProfileSettings />} />
            </div>
        </div>
    );
};