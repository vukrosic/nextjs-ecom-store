import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updateSize: (id: string, size: string) => void;
    clearCart: () => void;
}

export const useCartStore = create(
    persist<CartStore>(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id && i.size === item.size);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }] };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                })),
            updateSize: (id, size) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, size } : i
                    ),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
        }
    )
);