import { OrderItem as OrderItemType } from "@/kernel/types";
import {formatOrderType} from "@/shared/utils";

interface OrderItemProps {
    item: OrderItemType;
}

export const OrderItem = ({ item }: OrderItemProps) => {
    const discount =
        item.oldPrice && item.price < item.oldPrice
            ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
            : null;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };


    return (
        <div className="flex md:flex-row flex-col gap-3 pt-4 border-t-[1px] border-[#DBDEEF] items-start justify-between">
            <div className="flex gap-4 items-start">
                <img
                    src={item.photo}
                    alt={item.name}
                    style={{ aspectRatio: "60/82" }}
                    className="w-[60px] h-[82px] rounded-[6px] object-cover"
                />
                <div className="flex flex-col gap-3">
                    <h2 className="text-[14px] text-[#4E4F56] font-medium">{item.name}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="text-[16px] font-semibold text-[#333438]">{item.price}₽</h4>
                            <h4 className="text-[16px] font-semibold text-[#6A6B75]">x{item.quantity}</h4>
                        </div>
                        {discount && (
                            <div className="flex text-[11px] leading-[14px] text-[#E71730] font-semibold rounded-full bg-[#FEECEE] py-1 px-[6px] items-center justify-center">
                                -{discount}%
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex md:flex-col md:justify-start justify-between md:w-auto w-full gap-[6px]">
                <p className="text-[14px] font-medium text-[#4E4F56]">{formatOrderType(item.type)}</p>
                <p className="text-[14px] font-medium text-[#161616]">{formatDate(item.createdAt)}</p>
            </div>
        </div>
    );
};