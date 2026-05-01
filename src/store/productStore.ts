import { create } from 'zustand';
import type { Product, SearchFilters } from '../types';
import { fetchProductsFromFirestore } from '../services/firestoreService';
import { trackEvent } from '../lib/analytics';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  filters: SearchFilters;
  isLoading: boolean;
  setFilters: (filters: Partial<SearchFilters>) => void;
  applyFilters: () => void;
  setSelectedProduct: (product: Product | null) => void;
  fetchProducts: () => Promise<void>;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: '',
  minPrice: 0,
  maxPrice: 100000,
  rating: 0,
  sortBy: 'relevance',
};

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  filters: defaultFilters,
  isLoading: false,

  setFilters: (newFilters: Partial<SearchFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, filters } = get();
    let filtered = [...products];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          product.seller.storeName.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category.slug === filters.category
      );
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter((product) => product.price >= filters.minPrice);
    }

    if (filters.maxPrice < 100000) {
      filtered = filtered.filter((product) => product.price <= filters.maxPrice);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    set({ filteredProducts: filtered });
  },

  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  fetchProducts: async () => {
    set({ isLoading: true });
    const liveProducts = await fetchProductsFromFirestore();
    await trackEvent('view_item_list', { item_count: liveProducts.length });
    set({ products: liveProducts, filteredProducts: liveProducts, isLoading: false });
  },
}));
