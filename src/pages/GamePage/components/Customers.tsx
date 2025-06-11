import { useNotcoinGameStore } from "@/store/gameStore";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Visitor from "./Visitor";

const Customers = () => {
  const customers = useNotcoinGameStore((s) => s.customers);

  return (
    <div className="absolute z-[20] bottom-0 w-full h-[300px] overflow-hidden">
      <AnimatePresence>
        {customers.map((c) => (
          <motion.div
            key={c.id}
            initial={{ x: "-15%", opacity: 0 }}
            animate={{ x: "290%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 20, ease: "linear" },
              opacity: { duration: 0.5 },
            }}
            className="absolute bottom-0"
          >
            <Visitor type={c.wants} id={c.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
