import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShopItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  left: number;
  tags: Record<string, string>;
  images: string[];
}

export interface CartItem extends ShopItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: ShopItem) => void;
  removeFromCart: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.quantity < item.left
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          } else {
            return {
              items: [...state.items, { ...item, quantity: 1 }],
            };
          }
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      incrementQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.quantity < item.left
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
      },

      decrementQuantity: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
