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
    const username = user?.email ? user.email.split("@")[0] : "Anonymous User"

    return (
        <div className="flex sml:w-[35%] w-full md:gap-4 gap-1.5">
            <div
                style={{ aspectRatio: 1 / 1 }}
                className="md:w-[88px] w-[50px] md:h-[88px] h-[50px] bg-gray-400 rounded-[12px]"
            />
            <div className="flex md:w-auto sml:w-[150px] flex-col gap-1">
                <h5 className="md:text-[18px] text-[15px] font-semibold text-[#161616]">{username}</h5>
                <p className="text-[#4E4F56] sml:w-[180px] md:text-[14px] text-[12px] truncate">
                    {item?.name || "Product information not available"}
                </p>
            </div>
        </div>
    )
}
