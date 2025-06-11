import {
  ProductImages,
  ProductType,
} from "@/pages/GamePage/components/Products";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { create } from "zustand";

interface Customer {
  id: number;
  wants: ProductType;
}

interface GameState {
  customers: Customer[];
  selectedItem: ProductType | null;
  score: number;
  timeLeft: number;
  isRunning: boolean;
  startGame: () => void;
  stopGame: () => void;

  shuffledProducts: ProductType[];
  shuffleProducts: () => void;

  statusMessage: string | null;
  setStatusMessage: (message: string | null) => void;

  setSelectedItem: (item: ProductType) => void;
  giveItemToCustomer: (id: number) => void;
  spawnCustomer: () => void;
  decrementTime: () => void;
  registerMatchAttempt: () => void;
}

let customerIdCounter = 0;

export const useNotcoinGameStore = create<GameState>((set, get) => ({
  customers: [],
  selectedItem: null,
  score: 0,
  timeLeft: 60,
  isRunning: false,
  statusMessage: "Match a customer with the correct product!",
  shuffledProducts: Object.keys(ProductImages) as ProductType[],

  startGame: () => {
    customerIdCounter = 0;
    set({
      customers: [],
      selectedItem: null,
      score: 0,
      timeLeft: 60,
      isRunning: true,
    });
  },

  stopGame: () => set({ isRunning: false }),

  setSelectedItem: (item) => set({ selectedItem: item }),

  shuffleProducts: () =>
    set(() => {
      const keys = [...(Object.keys(ProductImages) as ProductType[])];
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }
      return { shuffledProducts: keys };
    }),

  setStatusMessage: (message) => set({ statusMessage: message }),

  spawnCustomer: () => {
    const productKeys = Object.keys(ProductImages) as ProductType[];
    const wants = productKeys[Math.floor(Math.random() * productKeys.length)];
    const id = customerIdCounter++;
    set((state) => ({
      customers: [...state.customers, { id, wants }],
    }));
  },

  giveItemToCustomer: (id) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === id);
    if (!customer || !state.selectedItem) return;

    const isCorrect = customer.wants === state.selectedItem;

    if (isCorrect) {
      hapticFeedback.isSupported() &&
        hapticFeedback.notificationOccurred("success");
    } else {
      hapticFeedback.isSupported() &&
        hapticFeedback.notificationOccurred("error");
    }

    set((state) => ({
      score: state.score + (isCorrect ? 1 : -1),
      customers: state.customers.filter((c) => c.id !== id),
      selectedItem: null,
      statusMessage: isCorrect ? "Correct match!" : "Wrong item!",
      timeLeft: isCorrect ? state.timeLeft + 2 : state.timeLeft - 1,
    }));

    get().registerMatchAttempt();
    get().shuffleProducts();

    // Reset message after short delay
    setTimeout(() => {
      get().setStatusMessage(null);
    }, 4000);
  },

  decrementTime: () =>
    set((state) => {
      if (state.timeLeft <= 1) {
        return { timeLeft: 0, isRunning: false };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),

  registerMatchAttempt: () => {},
}));
