import type React from "react"
import Image from "next/image"
import Link from "next/link";

interface Props {
    title: string
    description: string
    photo: string
}

export const CategoryBlock: React.FC<Props> = ({ title, description, photo }) => {
    return (
        <Link href="/catalog">
            <div
                className="flex flex-col overflow-hidden relative rounded-b-[20px] items-center pt-10 bg-[#F5F7FF] w-full lg:h-[321px] md:h-[250px] sm:h-[321px] h-[250px] rounded-[20px]">
                <div className="flex flex-col items-center gap-[6px]">
                    <h2 className="sml:text-[27px] text-[20px] sml:leading-[50px] leading-[25px] font-semibold text-[#161616]">
                        {title}
                    </h2>
                    <p className="sml:text-[16px] text-[14px] sml:leading-[23px] leading-[17px] text-[#6A6B75]">{description}</p>
                </div>
                <div className="absolute rounded-b-[20px] object-cover bottom-0">
                    <Image alt={title} src={photo || "/placeholder.svg"} width={452} height={150} priority/>
                </div>
            </div>
        </Link>
    )
}
