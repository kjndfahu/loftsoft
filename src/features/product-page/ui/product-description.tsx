type ProductDescriptionProps = {
    description: string
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-[14px] text-[#161616]">Описание</h4>
            <p className="text-[13px] text-[#4E4F56]">{description || "Описание отсутствует"}</p>
        </div>
    )
}
