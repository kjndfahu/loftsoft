// page.tsx (ItemPage)
import { BreadcrumbNav } from "@/shared/breadcrumb-nav"
import { ProductContainer } from "@/features/product-page/container/product-container"
import { RecomendationList } from "@/features/product-page/ui/recomendation-list"
import { notFound } from "next/navigation"
import { ItemFaqBlock } from "@/features/product-page/ui/item-faq-block"
import { ProductReviews } from "@/features/catalog/ui/product-review"
import { getItemReviews } from "@/enteties/review/review"
import { fetchProduct } from "@/enteties/product/product"

// Define Product interface to match server-side (for type safety)
interface Product {
    id: number
    name: string
    pricesByDuration: { durationId: string; price: { regular: string; discounted: string } }[]
    photos: string[]
    description?: string | null
    categoryId?: number | null
    type: string[]
    licenseType: string[]
    deviceCounts: number[]
    characteristics: { id: number; title: string; value: string }[]
    distributives: { id: number; displayName: string; fileUrl: string; logoUrl?: string }[]
    category?: { id: string; title: string } | null
    averageRating: number
    purchaseCount: number
    relatedProducts: Product[]
    reviews: { id: number; grade: number }[]
}

// Validate product data to ensure it matches the expected structure
const validateProduct = (item: any): Product => {
    if (!item || typeof item !== "object") {
        console.error("Invalid product data:", item)
        throw new Error("Invalid product data")
    }

    return {
        id: item.id || 0,
        name: item.name || "Unknown Product",
        pricesByDuration: Array.isArray(item.pricesByDuration)
            ? item.pricesByDuration.map((p: any) => ({
                durationId: p.durationId || "",
                price: {
                    regular: p.price?.regular || p.price || "0",
                    discounted: p.price?.discounted || p.price || "0",
                },
            }))
            : [],
        photos: Array.isArray(item.photos) ? item.photos : [],
        description: typeof item.description === "string" ? item.description : null,
        categoryId: typeof item.categoryId === "number" ? item.categoryId : null,
        type: Array.isArray(item.type) ? item.type : [],
        licenseType: Array.isArray(item.licenseType) ? item.licenseType : [],
        deviceCounts: Array.isArray(item.deviceCounts) ? item.deviceCounts : [1],
        characteristics: Array.isArray(item.characteristics)
            ? item.characteristics.filter(
                (c: any) => c && typeof c === "object" && c.id && c.title && c.value
            )
            : [],
        distributives: Array.isArray(item.distributives)
            ? item.distributives.filter(
                (d: any) => d && typeof d === "object" && d.id && d.fileUrl && d.displayName
            )
            : [],
        category: item.category && typeof item.category === "object"
            ? { id: item.category.id || "", title: item.category.title || "" }
            : null,
        averageRating: typeof item.averageRating === "number" ? item.averageRating : 0,
        purchaseCount: typeof item.purchaseCount === "number" ? item.purchaseCount : 0,
        relatedProducts: Array.isArray(item.relatedProducts) ? item.relatedProducts : [],
        reviews: Array.isArray(item.reviews) ? item.reviews : [],
    }
}

export default async function ItemPage({ params }: { params: { id: string } }) {
    const itemId = Number.parseInt(params.id)

    if (isNaN(itemId)) {
        notFound()
    }

    const rawItem = await fetchProduct(itemId)

    if (!rawItem) {
        notFound()
    }

    // Validate and normalize product data
    const item = validateProduct(rawItem)

    // Fetch reviews for the specific item
    const reviewResponse = await getItemReviews(itemId)

    // Debug: Log the normalized item to check for issues
    console.log("Normalized item:", {
        id: item.id,
        name: item.name,
        distributives: item.distributives,
        pricesByDuration: item.pricesByDuration,
        category: item.category,
    })

    // Extract reviews or set to empty array if fetch failed or no reviews
    const reviews = reviewResponse.success && reviewResponse.reviews ? reviewResponse.reviews : []

    return (
        <div className="flex flex-col pb-20 md:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] md:px-[100px] sm:px-[50px] px-[20px] gap-10">
            <BreadcrumbNav />
            <ProductContainer item={item} />
            <RecomendationList relatedProducts={item.relatedProducts} />
            <ItemFaqBlock item={item} />
            {reviews.length > 0 && <ProductReviews itemId={item.id} reviews={reviews} />}
        </div>
    )
}