import { useNotcoinGameStore } from "@/store/gameStore";
import { useEffect, useRef } from "react";
import useHaptic from "./useHaptic";

export function useNotcoinShopGame() {
  const isRunning = useNotcoinGameStore((s) => s.isRunning);
  const decrementTime = useNotcoinGameStore((s) => s.decrementTime);
  const spawnCustomer = useNotcoinGameStore((s) => s.spawnCustomer);
  const stopGame = useNotcoinGameStore((s) => s.stopGame);
  const timeLeft = useNotcoinGameStore((s) => s.timeLeft);
  const lastMatchTime = useRef(Date.now());

  const { heavyHaptic } = useHaptic();

  const gameTimerRef = useRef<number | null>(null);
  const spawnCheckRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    // Game timer: 1s ticks
    gameTimerRef.current = setInterval(() => {
      if (timeLeft <= 3 && timeLeft > 0) {
        heavyHaptic();
      }

      decrementTime();
    }, 1000);

    // Spawn checker: every 500ms
    spawnCheckRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastMatchTime.current > 5000) {
        spawnCustomer();
        lastMatchTime.current = now;
      }
    }, 500);

    return () => {
      clearInterval(gameTimerRef.current as number);
      clearInterval(spawnCheckRef.current as number);
    };
  }, [isRunning, decrementTime, spawnCustomer]);

  useEffect(() => {
    return () => {
      stopGame();
    };
  }, []);

  useNotcoinGameStore.setState({
    registerMatchAttempt: () => {
      lastMatchTime.current = Date.now();
      spawnCustomer();
    },
  });
}
