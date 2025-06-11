import { useDeferredValue, useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Page } from "@/components/Page.tsx";
import ItemCard from "@/pages/HomePage/components/ItemCard";
import { useCatalogue } from "@/api/queries/useCatalogue";
import HeaderWithSearch from "@/pages/HomePage/components/HeaderWithSearch";

import NotFoundImg from "@/assets/notFound.webp";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router";

export const HomePage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const deferredInputValue = useDeferredValue(inputValue);

  const { data = [], isLoading } = useCatalogue();
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.items);

  const filteredData = deferredInputValue
    ? data?.filter((item) =>
        item.name.toLowerCase().includes(deferredInputValue.toLowerCase()),
      )
    : data;

  const showNotFound = filteredData?.length === 0 && !isLoading;

  return (
    <Page back={false} className="px-[16px]">
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
          <motion.section
            className="flex-1 flex flex-wrap gap-x-[12px] gap-y-[28px] overflow-y-auto items-list"
            variants={{
              hidden: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
              visible: {
                transition: {
                  staggerChildren: 0.07,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative flex flex-col items-center gap-[8px] w-[calc(50%-6px)] h-fit"
                >
                  <ItemCard
                    data={item}
                    isChecked={cart.some((i) => i.id === item.id)}
                  />
                </motion.div>
              ))}
              <motion.div
                layout
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative flex flex-col items-center gap-[8px] w-[calc(50%-6px)] h-fit"
              >
                <div
                  className="w-full aspect-square bg-foreground/5 text-foreground rounded-[16px] px-[20px] text-[28px] font-[600] flex items-center justify-center"
                  onClick={() => navigate("/game")}
                >
                  ?
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.section>
        )}
      </motion.div>
    </Page>
  );
};
