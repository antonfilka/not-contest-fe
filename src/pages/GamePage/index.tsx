import Customers from "@/pages/GamePage/components/Customers";
import GameStartOverlay from "@/pages/GamePage/components/GameStartOverlay";
import Header from "@/pages/GamePage/components/Header";
import Products from "@/pages/GamePage/components/Products";
import SpottyWithMessages from "@/pages/GamePage/components/SpottyWithMessages";
import { useNotcoinShopGame } from "@/hooks/useNotcoinShopGame";
import { AnimatePresence, motion } from "framer-motion";
import { Page } from "@/components/Page";
import Particles from "@/components/ParticlesBg";

export const GamePage = () => {
  useNotcoinShopGame();

  return (
    <AnimatePresence mode="wait">
      <Page back>
        <GameStartOverlay />
        <motion.div
          key="game-page"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative w-full h-full bg-black"
        >
          <Header />
          <Products />
          <SpottyWithMessages />
          <Customers />
          <Particles className="absolute top-0 left-0 z-[0] opacity-40" />
        </motion.div>
      </Page>
    </AnimatePresence>
  );
};
