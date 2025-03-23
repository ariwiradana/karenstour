import { Category } from "@/constants/types";
import { create } from "zustand";

interface StoreState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<StoreState>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),
}));
