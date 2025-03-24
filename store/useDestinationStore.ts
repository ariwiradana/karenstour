import { Destination } from "@/constants/types";
import { create } from "zustand";

interface StoreState {
  destinations: Destination[];
  totalRows: number;
  setDestinations: (destinations: Destination[]) => void;
  setTotalRows: (rows: number) => void;
}

export const useDestinationStore = create<StoreState>((set) => ({
  destinations: [],
  totalRows: 0,
  setDestinations: (destinations: Destination[]) =>
    set((state) => ({ ...state, destinations })),
  setTotalRows: (totalRows: number) =>
    set((state) => ({ ...state, totalRows })),
}));
