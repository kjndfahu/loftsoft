import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
    id: string
    name: string
    price: number
    oldPrice?: number
    quantity: number
    photo?: string
    type?: string
    licenseType?: string
    deviceCount?: number
}

type CartStore = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)

                    if (existingItem) {
                        return {
                            items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
                        }
                    }

                    return {
                        items: [...state.items, { ...item, quantity: 1 }],
                    }
                }),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
                })),

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },
        }),
        {
            name: "cart-storage",
        },
    ),
)