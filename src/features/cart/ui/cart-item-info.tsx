"use client"

type CartItemInfoProps = {
    name?: string
    photo?: string
    licenseType?: string
}

export const CartItemInfo = ({
                                 name = "Лицензионный ключ активации для Windows 11 Pro (Профессиональная)",
                                 photo,
                                 licenseType = "1 ПК",
                             }: CartItemInfoProps) => {
    return (
        <div className="flex items-start gap-[20px]">
            <input className="border-[2px] bg-[#CACDDC]" type="checkbox" />
            <div className="bg-gray-400 rounded-[12px] w-[84px] h-[117px]">
                {photo && (
                    <img src={photo || "/placeholder.svg"} alt={name} className="w-full h-full object-cover rounded-[12px]" />
                )}
            </div>
            <div className="flex flex-col gap-[6px]">
                <h3 className="text-[16px] w-[388px] font-semibold text-[#161616]">{name}</h3>
                <p className="text-[12px] text-[#858692]">{licenseType}</p>
            </div>
        </div>
    )
}
