import React from "react";
import SpottyImg from "@/assets/game/spotty.png";
import { useNotcoinGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";

const SpottyWithMessages = () => {
  const statusMessage = useNotcoinGameStore((s) => s.statusMessage);

  const message = statusMessage || "Match a customer with the correct product!";

  return (
    <div className="absolute z-[5] left-[20px] right-[20px] top-[45%] select-none pointer-events-none flex items-center">
      <div className="flex-1 text-center text-white text-xl min-h-[30px]">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-semibold"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* <img src={SpottyImg} alt="Spotty" className="w-[200px]" /> */}
    </div>
  );
};

export default SpottyWithMessages;
