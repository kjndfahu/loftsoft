import {AdminReview} from "@/features/admin-reviews/ui/admin-review";

export default function AdminReviewsPage() {
    return (
        <div className="flex flex-col py-[150px] pl-[350px] pr-[100px] gap-5">
            <AdminReview/>
            <AdminReview/>
            <AdminReview/>
        </div>
    );
}
