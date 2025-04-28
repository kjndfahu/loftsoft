import Image from "next/image"


interface CategoryBlockProps {
    category: {
        id: number
        photo: string
        title: string
        description: string
        createdAt: Date
        updateAt: Date
    }
}

export const CategoryBlock = ({ category }: CategoryBlockProps) => {
    return (
        <div className="flex flex-col border-[1px] w-[440px] rounded-[20px] p-5 gap-8">
            <div className="relative w-[400px] h-[150px] rounded-[10px] overflow-hidden">
                <Image
                    src={category.photo || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-[10px]"
                />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-[18px] text-black font-medium">{category.title}</h3>
                <p className="text-[14px] text-[#4E4F56]">{category.description}</p>
            </div>
        </div>
    )
}
