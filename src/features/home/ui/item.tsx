import Image from "next/image";
import Link from "next/link";
import { StarLogo } from "@/shared/icons";
import { Product } from "@/features/home/ui/items-grid";

interface ItemsProps {
    product?: Product;
}

export const Items = ({ product }: ItemsProps) => {
    if (!product) {
        return (
            <div className="flex flex-col w-full mds:gap-6 gap-[10px]">
                <div
                    style={{ aspectRatio: "312/415" }}
                    className="w-full bg-[#F5F7FF] rounded-[16px] relative overflow-hidden"
                >
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Товар не найден</span>
                    </div>
                </div>
            </div>
        );
    }

    const formatPrice = (price: string) => {
        if (!price) return "0";
        const numPrice = Number.parseFloat(price);
        return new Intl.NumberFormat("ru-RU").format(numPrice);
    };

    const isBase64Image = (src: string) => {
        if (!src) return false;
        return src.startsWith("data:image") || src.startsWith("data:img");
    };

    const renderImage = () => {
        if (!product.photo) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Нет фото</span>
                </div>
            );
        }

        if (isBase64Image(product.photo)) {
            return (
                <img
                    src={product.photo || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                />
            );
        } else {
            return (
                <Image
                    src={
                        product.photo.startsWith("/")
                            ? product.photo
                            : `/placeholder.svg?height=415&width=312&query=${product.name}`
                    }
                    alt={product.name || "Товар"}
                    fill
                    className="object-cover"
                />
            );
        }
    };

    return (
        <Link
            href={`/catalog/${product.id || ""}`}
            className="flex flex-col w-full mds:gap-6 gap-[10px]"
        >
            <div
                style={{ aspectRatio: "312/415" }}
                className="w-full bg-[#F5F7FF] rounded-[16px] relative overflow-hidden"
            >
                {renderImage()}
            </div>
            <div className="flex flex-col text-[#161616] sm:gap-[10px] gap-2">
                <h3 className="mds:text-[27px] sm:text-[20px] text-[16px] font-semibold">
                    {formatPrice(product.price)} ₽
                </h3>
                <div className="flex font-medium mds:text-[16px] sm:text-[14px] text-[12px] gap-1">
                    <div className="flex items-center gap-[6px] py-[4px] px-[6px] text-[#5069E8] bg-[#5F78EE26] rounded-[6px]">
                        <StarLogo color="#5069E8" />
                        {(product.averageRating ?? 0).toFixed(1)}
                    </div>
                    <div className="flex bg-[#ACB1C626] rounded-[6px] text-[#161616] py-[4px] px-[6px]">
                        {product.purchaseCount} купили
                    </div>
                </div>
                <p className="mds:text-[20px] sm:text-[17px] text-[14px] font-medium">
                    {product.name}
                </p>
            </div>
        </Link>
    );
};