import { Category } from "@/constants/types";
import { create } from "zustand";

interface StoreState {
  categoryFilterId: number | null;
  setCategoryFilterId: (categoryFilterId: number | null) => void;
}

export const useDestinationDetailStore = create<StoreState>((set) => ({
  categoryFilterId: null,
  setCategoryFilterId: (categoryFilterId: number | null) =>
    set({ categoryFilterId }),
}));
