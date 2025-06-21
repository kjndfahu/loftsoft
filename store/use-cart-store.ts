// /src/store/use-cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    quantity: number;
    photo?: string;
    type?: string;
    licenseType?: string;
    deviceCount?: number;
    uniqueKey: string; // Добавляем поле для уникального идентификатора
};

type CartStore = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity" | "uniqueKey">) => void;
    removeItem: (uniqueKey: string) => void;
    updateQuantity: (uniqueKey: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
};

// Генерация уникального ключа на основе характеристик товара
const generateUniqueKey = (item: Omit<CartItem, "quantity" | "uniqueKey">): string => {
    return `${item.id}-${item.type || "default"}-${item.licenseType || "default"}-${item.deviceCount || 1}-${item.price}`;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const uniqueKey = generateUniqueKey(item);
                set((state) => {
                    const existingItem = state.items.find((i) => i.uniqueKey === uniqueKey);

                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.uniqueKey === uniqueKey ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { ...item, quantity: 1, uniqueKey }],
                    };
                });
            },

            removeItem: (uniqueKey) =>
                set((state) => ({
                    items: state.items.filter((item) => item.uniqueKey !== uniqueKey),
                })),

            updateQuantity: (uniqueKey, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.uniqueKey === uniqueKey ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                })),

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: "cart-storage",
        }
    )
);