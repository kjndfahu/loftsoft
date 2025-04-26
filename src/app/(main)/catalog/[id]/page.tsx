import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { ProductContainer } from "@/features/product-page/container/product-container"
import { RecomendationList } from "@/features/product-page/ui/recomendation-list"
import { Reviews } from "@/features/product-page/container/reviews"
import { notFound } from "next/navigation"
import {prisma} from "../../../../../prisma/prisma-client";

export default async function ItemPage({ params }: { params: { id: string } }) {
    const itemId = Number.parseInt(params.id)

    if (isNaN(itemId)) {
        notFound()
    }

    const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: {
            characteristics: true,
            distributives: true,
            category: true,
        },
    })

    if (!item) {
        notFound()
    }

    return (
        <div className="flex flex-col pt-[150px] px-[250px] gap-10">
            <BreadcrumbNav title={item.category?.title || "Каталог"} />
            <ProductContainer item={item} />
            <RecomendationList />
            <Reviews />
        </div>
    )
}
