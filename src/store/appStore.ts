import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  paymentStatus: "none" | "pending" | "success" | "error";

  setPaymentStatus: (status: AppState["paymentStatus"]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      paymentStatus: "none",

      setPaymentStatus: (status) => set({ paymentStatus: status }),
    }),
    {
      name: "app-storage",
    },
  ),
);
