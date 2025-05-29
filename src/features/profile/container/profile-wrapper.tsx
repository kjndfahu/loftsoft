"use client";

import { ProfileSections } from "@/features/profile/ui/profile-sections";
import React, { useState, useEffect } from "react";
import { BreadcrumbNav } from "@/shared/breadcrumb-nav";
import { Profile } from "@/features/profile/container/profile";
import { OrderList } from "@/features/profile/container/order-list";
import { usePathname } from "next/navigation";

export const ProfileWrapper = () => {
    const pathname = usePathname();
    const initialTab = pathname === "/orders" ? "orders" : "profile";
    const [tab, setTab] = useState(initialTab);

    useEffect(() => {
        setTab(pathname === "/orders" ? "orders" : "profile");
    }, [pathname]);

    return (
        <div className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] sml:gap-10 gap-4">
            {tab === "profile" ? (
                <BreadcrumbNav title="Профиль" />
            ) : (
                <BreadcrumbNav title="Заказы" />
            )}
            <div className="flex sml:flex-row flex-col mds:gap-6 gap-3">
                <ProfileSections tab={tab} setTab={setTab} />
                <div className="flex flex-col flex-1 gap-6">
                    {tab === "profile" ? (
                        <Profile />
                    ) : (
                        <OrderList />
                    )}
                </div>
            </div>
        </div>
    );
};