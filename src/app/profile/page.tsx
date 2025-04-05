import {BreadcrumbNav} from "@/shared/breadcrumb-nav";
import {Profile} from "@/features/profile/container/profile";

export default function ProfilePage() {
    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav/>
            <Profile/>
        </div>
    );
}
