"use client"

type CartItemInfoProps = {
    name?: string
    photo?: string
    licenseType?: string
    isChecked?: boolean
    onCheckboxChange?: (checked: boolean) => void
}

export const CartItemInfo = ({
                                 name = "Лицензионный ключ активации для Windows 11 Pro (Профессиональная)",
                                 photo,
                                 licenseType = "1 ПК",
                                 isChecked = false,
                                 onCheckboxChange,
                             }: CartItemInfoProps) => {
    return (
        <div className="flex items-start w-[65%] md:gap-[20px] gap-[10px]">
            <input
                className="border-[2px] bg-[#CACDDC]"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onCheckboxChange?.(e.target.checked)}
            />
            <div className="bg-gray-400 rounded-[12px] w-[84px] h-[117px]">
                {photo && (
                    <img src={photo || "/placeholder.svg"} alt={name} className="w-full h-full object-cover rounded-[12px]" />
                )}
            </div>
            <div className="flex flex-col sml:gap-[6px] gap-1">
                <h3 className="md:text-[16px] sml:text-[14px] text-[11px] font-semibold text-[#161616]">{name}</h3>
                <p className="text-[12px] text-[#858692]">{licenseType}</p>
            </div>
        </div>
    )
}