import { useDeferredValue, useEffect, useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Page } from "@/components/Page.tsx";
import ItemCard from "@/components/ItemCard";
import { useCatalogue } from "@/api/queries/useCatalogue";
import HeaderWithSearch from "@/components/HeaderWithSearch";

import NotFoundImg from "@/assets/notFound.png";
import { useCartStore } from "@/store/cartStore";

export const HomePage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const deferredInputValue = useDeferredValue(inputValue);

  const { data = [], isLoading } = useCatalogue();

  useEffect(() => {
    const img = new Image();
    img.src = NotFoundImg;
  }, []);

  const cart = useCartStore((state) => state.items);

  const filteredData = deferredInputValue
    ? data?.filter((item) =>
        item.name.toLowerCase().includes(deferredInputValue.toLowerCase()),
      )
    : data;

  const showNotFound = filteredData?.length === 0 && !isLoading;

  return (
    <Page back={false}>
      <img
        src={NotFoundImg}
        className="opacity-0 pointer-events-none absolute z-[-100]"
      />
      <motion.div
        className="w-full h-full flex flex-col"
        variants={{
          initial: { opacity: 0, y: 10, scale: 0.99 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 0, scale: 0.9 },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <HeaderWithSearch
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <AnimatePresence>
          <motion.div
            key="not-found"
            animate={showNotFound ? "animate" : "hidden"}
            variants={{
              initial: { opacity: 0, y: 20, scale: 0.6 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
              hidden: { opacity: 0, y: 20, pointerEvents: "none" },
            }}
            initial="initial"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[50%] left-0 right-0 flex-1 w-full flex flex-col items-center justify-center"
          >
            <img
              src={NotFoundImg}
              className="mb-[14px] w-[80px] h-[80px]"
              loading="lazy"
            />
            <p className="text-[26px] text-foreground font-[600] leading-[32px] self-center mb-[8px]">
              Not Found
            </p>
            <p className="text-[17px] text-black dark:text-white opacity-50 font-[400] leading-[22px] self-center">
              This style doesn’t exist
            </p>
          </motion.div>
        </AnimatePresence>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {filteredData?.length > 0 && !isLoading && (
          <section className="flex-1 flex flex-wrap gap-x-[12px] gap-y-[28px] overflow-y-auto items-list">
            <AnimatePresence initial={false}>
              {filteredData?.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative flex flex-col items-center gap-[8px] w-[calc(50%-6px)] h-fit"
                >
                  <ItemCard
                    data={item}
                    isChecked={cart.some((i) => i.id === item.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        )}
      </motion.div>
    </Page>
  );
};
