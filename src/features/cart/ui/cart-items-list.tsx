// /src/features/cart/ui/cart-items-list.tsx
"use client";

import { ItemType } from "@/features/cart/ui/item-type";
import { CartItemInfo } from "@/features/cart/ui/cart-item-info";
import { CartPriceBlock } from "@/features/cart/ui/cart-price-block";
import { TrashLogo } from "@/shared/icons";
import { useCartStore } from "../../../../store/use-cart-store";

const subscriptionTypeLabels: Record<string, string> = {
    KEY: "Ключ",
    SUBSCRIPTION: "Подписка",
    ACCOUNT: "Аккаунт",
};

export const CartItemsList = ({
                                  onSelectionChange,
                                  selectedItems,
                                  setSelectedItems,
                              }: {
    onSelectionChange?: (selectedIds: string[]) => void;
    selectedItems: string[];
    setSelectedItems: (items: string[]) => void;
}) => {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);

    const groupedItems = items.reduce(
        (acc, item) => {
            const type = item.type || "Ключ";
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        },
        {} as Record<string, typeof items>
    );

    const handleCheckboxChange = (uniqueKey: string, checked: boolean) => {
        let updatedSelection: string[];
        if (checked) {
            updatedSelection = [...selectedItems, uniqueKey];
        } else {
            updatedSelection = selectedItems.filter((id) => id !== uniqueKey);
        }
        setSelectedItems(updatedSelection);
        if (onSelectionChange) {
            onSelectionChange(updatedSelection);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center w-full py-10">
                <p className="text-[18px] text-[#858692]">Ваша корзина пуста</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-[20px]">
            {Object.entries(groupedItems).map(([type, typeItems]) => (
                <div key={type} className="flex flex-col py-5 border-t-[1px] last:border-b-[1px] gap-[20px]">
                    <ItemType type={subscriptionTypeLabels[type] || type} />
                    {typeItems.map((item) => (
                        <div
                            key={item.uniqueKey}
                            className="flex items-start w-full md:gap-[80px] gap-5 justify-between"
                        >
                            <CartItemInfo
                                name={item.name}
                                photo={item.photo}
                                licenseType={`${item.deviceCount} ПК, ${item.licenseType}`}
                                isChecked={selectedItems.includes(item.uniqueKey)}
                                onCheckboxChange={(checked) => handleCheckboxChange(item.uniqueKey, checked)}
                            />
                            <CartPriceBlock
                                price={item.price}
                                oldPrice={item.oldPrice}
                                quantity={item.quantity}
                                itemId={item.uniqueKey}
                            />
                            <div onClick={() => removeItem(item.uniqueKey)}>
                                <TrashLogo className="cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};