import { BoxLogo, UserLogo } from "@/shared/icons";
import Link from "next/link";
import { useState, useEffect } from "react";

export const ProfileSections = ({ tab, setTab }: { tab: string, setTab: (tab: string) => void }) => {
    const [isSml, setIsSml] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSml(window.innerWidth <= 650);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-full mds:w-[312px] w-[230px] flex-col gap-[12px] rounded-[16px] sml:border-[1px] border-[#E9EBF6] sml:p-3">
            <p className="mds:flex hidden text-[13px] text-[#4E4F56]">Разделы</p>
            <div className="flex sml:flex-col flex-row sml:gap-0 gap-2">
                <Link href="/profile">
                    <div
                        onClick={() => setTab("profile")}
                        className={`flex items-center cursor-pointer ${
                            tab === "profile"
                                ? "sml:bg-[#F5F7FF] bg-[#5069E8] sml:border-r-[4px] border-[#5069E8]"
                                : "sml:bg-white bg-[#F5F7FF]"
                        } gap-[6px] sml:rounded-[8px] rounded-full py-[11px] px-[16px]`}
                    >
                        {tab === "profile" ? (
                            <UserLogo color={isSml ? "#ffffff" : "#5069E8"} />
                        ) : (
                            <UserLogo color="#161616" />
                        )}
                        <h4
                            className={`${
                                tab === "profile" ? "sml:text-[#5069E8] text-white" : "text-[#161616]"
                            } text-[14px]`}
                        >
                            Профиль
                        </h4>
                    </div>
                </Link>
                <Link href="/orders">
                    <div
                        onClick={() => setTab("orders")}
                        className={`flex items-center cursor-pointer ${
                            tab === "orders"
                                ? "sml:bg-[#F5F7FF] bg-[#5069E8] sml:border-r-[4px] border-[#5069E8]"
                                : "sml:bg-white bg-[#F5F7FF]"
                        } gap-[6px] sml:rounded-[8px] rounded-full py-[11px] px-[16px]`}
                    >
                        {tab === "orders" ? (
                            <BoxLogo color={isSml ? "#ffffff" : "#5069E8"} />
                        ) : (
                            <BoxLogo color="#161616" />
                        )}
                        <h4
                            className={`${
                                tab === "orders" ? "sml:text-[#5069E8] text-white" : "text-[#161616]"
                            } text-[14px]`}
                        >
                            Заказы
                        </h4>
                    </div>
                </Link>
            </div>
        </div>
    );
};