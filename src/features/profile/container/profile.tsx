'use client'

import {ProfileSections} from "@/features/profile/ui/profile-sections";
import {BlockWrapper} from "@/features/profile/ui/block-wrapper";
import {ProfileInfo} from "@/features/profile/ui/profile-info";
import {ProfileSettings} from "@/features/profile/ui/profile-settings";
import {useState} from "react";
import {OrderList} from "@/features/profile/container/order-list";
import {RefProgram} from "@/features/profile/ui/ref-program";
import {useUser} from "@/enteties/auth/use-user";

export const Profile = () => {
    const [tab, setTab] = useState('profile')
    const {user} = useUser()
    console.log(user?.referralCode)
    return (
        <div className="flex gap-6">
            <ProfileSections tab={tab} setTab={setTab}/>
            {tab === 'profile' && user ? (
                <div className="flex flex-col flex-1 gap-6">
                    <BlockWrapper title="О ПРОФИЛЕ" form={<ProfileInfo email={user?.email}/>}/>
                    <BlockWrapper title="РЕФЕРАЛЬНАЯ ПРОГРАММА" form={<RefProgram userEmail={user.email} refCode={user?.referralCode}/>}/>
                    <BlockWrapper title="НАСТРОЙКИ" form={<ProfileSettings/>}/>
                </div>
            ) : (
                <OrderList/>
            )}
        </div>
    )
}
