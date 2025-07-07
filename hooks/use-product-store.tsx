"use client"

import { create } from "zustand"
import type { Product } from "@/types/product"

interface ProductStore {
  selectedProduct: Product | null
  hoveredProductName: string | null
  selectProduct: (product: Product) => void
  closeProduct: () => void
  setHoveredProduct: (name: string) => void
  clearHoveredProduct: () => void
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  hoveredProductName: null,
  selectProduct: (product) => set({ selectedProduct: product }),
  closeProduct: () => set({ selectedProduct: null }),
  setHoveredProduct: (name) => set({ hoveredProductName: name }),
  clearHoveredProduct: () => set({ hoveredProductName: null }),
}))
