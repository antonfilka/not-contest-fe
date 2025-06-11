import useTelegram from "@/hooks/useTelegram";
import { useNotcoinGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

const GameStartOverlay = () => {
  const isRunning = useNotcoinGameStore((s) => s.isRunning);
  const startGame = useNotcoinGameStore((s) => s.startGame);
  const score = useNotcoinGameStore((s) => s.score);

  const { launchParams } = useTelegram();

  const [lastScore, setLastScore] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("notcoin_last_score");
    if (stored) {
      setLastScore(parseInt(stored));
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      localStorage.setItem("notcoin_last_score", String(score));
      setLastScore(score);
    }
  }, [isRunning, score]);

  return (
    <AnimatePresence>
      {!isRunning && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center px-6 py-8 bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md  min-w-[300px]"
          >
            <h1 className="text-3xl md:text-5xl text-white font-bold mb-4">
              {lastScore !== 0
                ? "Try again!"
                : `Hi, ${launchParams.tgWebAppData?.user?.first_name || ""}`}
            </h1>

            {lastScore !== 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-lg mb-4"
              >
                Last Score: <span className="font-semibold">{lastScore}</span>
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-3 bg-white text-black font-semibold text-xl rounded-full shadow-md hover:bg-gray-100 transition"
            >
              {lastScore !== 0 ? "Restart" : " Start!"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameStartOverlay;
