import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  open: boolean;
}

interface SidebarActions {
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set) => ({
      open: true,
      setOpen: (open) => set({ open }),
      toggleSidebar: () => set((state) => ({ open: !state.open })),
    }),
    {
      name: "sidebar-storage", // nombre de la clave en localStorage
    }
  )
);
