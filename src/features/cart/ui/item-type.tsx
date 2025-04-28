type ItemTypeProps = {
    type?: string
}

export const ItemType = ({ type = "Ключ" }: ItemTypeProps) => {
    return <div className="w-full text-[12px] text-[#6A6B75] bg-[#F5F7FF] rounded-full px-[10px] py-2">{type}</div>
}
