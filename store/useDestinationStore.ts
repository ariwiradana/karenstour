import { Destination } from "@/constants/types";
import { create } from "zustand";

interface StoreState {
  destinations: Destination[];
  setDestinations: (destinations: Destination[]) => void;
}

export const useDestinationStore = create<StoreState>((set) => ({
  destinations: [],
  setDestinations: (destinations: Destination[]) => set({ destinations }),
}));
