import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { ProductContainer } from "@/features/product-page/container/product-container"
import { RecomendationList } from "@/features/product-page/ui/recomendation-list"
import { notFound } from "next/navigation"
import { fetchProduct } from "@/enteties/product/product"
import { ItemFaqBlock } from "@/features/product-page/ui/item-faq-block"
import { ProductReviews } from "@/features/catalog/ui/product-review"

export default async function ItemPage({ params }: { params: { id: string } }) {
    const itemId = Number.parseInt(params.id)

    if (isNaN(itemId)) {
        notFound()
    }

    const item = await fetchProduct(itemId)

    if (!item) {
        notFound()
    }

    // Debug: Log the item to check for undefined properties
    console.log("Fetched item:", item.category)

    return (
        <div className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav />
            <ProductContainer item={item} />
            <RecomendationList relatedProducts={item.relatedProducts} />
            <ItemFaqBlock item={item} />
            <ProductReviews itemId={item.id} /> {/* Pass itemId to ProductReviews */}
        </div>
    )
}