import {CreateProductBtn} from "@/features/create-product/ui/create-product-btn";

export default async function CreateProductPage() {
    return (
        <div className="flex flex-col py-[150px] pl-[350px] pr-[100px] w-full gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] text-black font-semibold">Товары:</h1>
                <CreateProductBtn />
            </div>
        </div>
    )
}
