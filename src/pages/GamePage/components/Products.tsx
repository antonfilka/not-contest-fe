import React from "react";
import TShirt1 from "@/assets/game/t-shirt1.png";
import TShirt2 from "@/assets/game/t-shirt2.png";
import Sneaker from "@/assets/game/sneaker.png";
import Cap from "@/assets/game/cap.png";
import Hoody1 from "@/assets/game/hoody1.png";
import Hoody2 from "@/assets/game/hoody2.png";
import Hoody3 from "@/assets/game/hoody3.png";
import { useNotcoinGameStore } from "@/store/gameStore";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useHaptic from "@/hooks/useHaptic";

export const ProductImages = {
  tShirt1: TShirt1,
  tShirt2: TShirt2,
  sneaker: Sneaker,
  cap: Cap,
  hoody1: Hoody1,
  hoody2: Hoody2,
  hoody3: Hoody3,
};

export type ProductType = keyof typeof ProductImages;

interface ProductsProps {
  direction?: "left" | "right";
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const Products: React.FC<ProductsProps> = ({ className }) => {
  const setSelectedItem = useNotcoinGameStore((s) => s.setSelectedItem);
  const selectedItem = useNotcoinGameStore((s) => s.selectedItem);
  const shuffledProducts = useNotcoinGameStore((s) => s.shuffledProducts);

  const { lightHaptic } = useHaptic();

  const handleProductClick = (product: ProductType) => {
    lightHaptic();
    setSelectedItem(product);
  };

  const productClassName = "w-[90px] cursor-pointer";

  const half = Math.ceil(shuffledProducts.length / 2);
  const row1 = shuffledProducts.slice(0, half);
  const row2 = shuffledProducts.slice(half);

  return (
    <div
      className={cn(
        "absolute top-[80px] left-0 w-full overflow-hidden z-30 pointer-events-auto space-y-2",
        className,
      )}
    >
      <div className="absolute z-[10] top-[10px] w-full h-[2px] bg-white" />
      <div className="absolute z-[10] top-[107px] w-full h-[2px] bg-white" />

      {[row1, row2].map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="flex gap-[10px] justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <AnimatePresence mode="popLayout">
            {row.map((key) => (
              <motion.img
                layout
                key={key}
                src={ProductImages[key]}
                alt={key}
                className={productClassName}
                onClick={() => handleProductClick(key)}
                style={{
                  border: selectedItem === key ? "1px solid white" : "",
                  borderRadius: "20px",
                  padding: "5px",
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default Products;
