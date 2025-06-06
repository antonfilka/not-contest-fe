import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  paymentStatus: "none" | "pending" | "success" | "error";
  hasCompletedPayments: boolean;

  setPaymentStatus: (status: AppState["paymentStatus"]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      paymentStatus: "none",
      hasCompletedPayments: false,

      setPaymentStatus: (status) => {
        set({ paymentStatus: status });
        if (status === "success") {
          set({ hasCompletedPayments: true });
        }
      },
    }),
    {
      name: "app-storage",
    },
  ),
);
