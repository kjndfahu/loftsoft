import { Items } from "@/features/home/ui/item"

type RecomendationListProps = {
    relatedProducts: {
        id: number
        name: string
        price: string
        photo: string
        category: { name: string }
    }[]
}

export const RecomendationList = ({ relatedProducts }: RecomendationListProps) => {
    return (
        <div className="flex flex-col gap-6">
            {relatedProducts.length > 0 && (<h3 className="text-[27px] text-[#161616]">Еще может подойти</h3>)}
            {relatedProducts.length > 0 && (
                <div className="grid mds:grid-cols-4 grid-cols-2 justify-between md:gap-6 gap-4 w-full">
                    {relatedProducts.map((product) => (
                        <Items
                            key={product.id}
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                photo: product.photo,
                                category: product.category.name,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}