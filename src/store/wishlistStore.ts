import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product: Product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleWishlist: (product: Product) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product);
        }
      },
    }),
    {
      name: 'bazaarpk-wishlist',
    }
  )
);
