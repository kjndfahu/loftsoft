import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { ProductContainer } from "@/features/product-page/container/product-container"
import { RecomendationList } from "@/features/product-page/ui/recomendation-list"
import { notFound } from "next/navigation"
import { ItemFaqBlock } from "@/features/product-page/ui/item-faq-block"
import { ProductReviews } from "@/features/catalog/ui/product-review"
import {getItemReviews} from "@/enteties/review/review";
import {fetchProduct} from "@/enteties/product/product";


// Define Product interface to match server-side (for type safety)
interface Product {
    id: number
    name: string
    pricesByDuration: { durationId: string; price: string }[]
    photos: string[]
    description?: string | null
    categoryId?: number | null
    type: string[]
    licenseType: string[]
    deviceCounts: number[]
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string }[]
    category?: { id: string; title: string } | null
    averageRating: number
    purchaseCount: number
    relatedProducts: Product[]
    reviews: { id: number; grade: number }[]
}

export default async function ItemPage({ params }: { params: { id: string } }) {
    const itemId = Number.parseInt(params.id)

    if (isNaN(itemId)) {
        notFound()
    }

    const item = await fetchProduct(itemId)

    if (!item) {
        notFound()
    }

    // Fetch reviews for the specific item
    const reviewResponse = await getItemReviews(itemId)

    // Debug: Log the item to check for undefined properties
    console.log("Fetched item:", item.category)

    // Extract reviews or set to empty array if fetch failed or no reviews
    const reviews = reviewResponse.success && reviewResponse.reviews ? reviewResponse.reviews : []

    return (
        <div className="flex flex-col pb-20 md:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] md:px-[100px] sml:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav />
            <ProductContainer item={item} />
            <RecomendationList relatedProducts={item.relatedProducts} />
            <ItemFaqBlock item={item} />
            {reviews.length > 0 && <ProductReviews itemId={item.id} reviews={reviews} />}
        </div>
    )
}