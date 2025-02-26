import { create } from "zustand";

interface AccessStore {
  hasAccess: boolean;
  setAccess: (value: boolean) => void;
}

const useAccessStore = create<AccessStore>((set) => ({
  hasAccess: false, // Initial state: no access
  setAccess: (value) => set({ hasAccess: value }),
}));

export default useAccessStore;
