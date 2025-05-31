interface ReviewUserInfoProps {
    user?: {
        id: number
        email: string
    } | null
    item?: {
        id: number
        name: string
    } | null
}

export const ReviewUserInfo = ({ user, item }: ReviewUserInfoProps) => {
    const maskEmail = (email: string): string => {
        const [localPart, domain] = email.split("@")
        if (localPart.length <= 4) {
            return `${localPart.charAt(0)}***@${domain}`
        }
        const visiblePart = localPart.substring(0, 4)
        return `${visiblePart}***@${domain}`
    }

    const username = user?.email ? maskEmail(user.email) : undefined
    const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : 'Z';

    return (
        <div className="flex sml:w-[35%] w-full md:gap-4 gap-1.5">
            <div
                style={{ aspectRatio: 1 / 1 }}
                className="flex items-center justify-center text-black font-semibold text-[27px] md:w-[88px] w-[50px] md:h-[88px] h-[50px] bg-[#F5F7FF] rounded-[12px]"
            >{firstLetter}</div>
            <div className="flex md:w-auto sml:w-[150px] flex-col gap-1">
                <h5 className="md:text-[18px] text-[15px] font-semibold text-[#161616]">{username}</h5>
                <p className="text-[#4E4F56] sml:w-[180px] md:text-[14px] text-[12px] truncate">
                    {item?.name || "Product information not available"}
                </p>
            </div>
        </div>
    )
}