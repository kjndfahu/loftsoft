import Link from "next/link"

type ProductSpecificationsProps = {
    characteristics: any[]
}

export default function ProductSpecifications({ characteristics }: ProductSpecificationsProps) {
    return (
        <div className="">
            <h1 className="text-[14px] text-[#161616] mb-[12px]">Характеристики товара:</h1>

            <div className="space-y-4">
                {characteristics.map((characteristic) => (
                    <div key={characteristic.id} className="flex items-baseline">
                        <div className="text-[13px] text-[#4E4F56]">{characteristic.title}</div>
                        <div className="flex-grow mx-2 relative">
                            <div className="absolute bottom-0 w-full border-b border-dashed border-gray-300"></div>
                        </div>
                        <div className="flex-shrink-0 text-right text-[13px] text-[#4E4F56] font-medium">
                            {characteristic.value}
                        </div>
                    </div>
                ))}

                <div className="flex items-baseline">
                    <div className="text-[13px] text-[#4E4F56]">Инструкция по установке</div>
                    <div className="flex-grow mx-2 relative">
                        <div className="absolute bottom-0 w-full border-b border-dashed border-gray-300"></div>
                    </div>
                    <div className="flex-shrink-0 text-right text-[13px] font-medium">
                        <Link href="#" className="text-blue-500 hover:underline">
                            Читать
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
