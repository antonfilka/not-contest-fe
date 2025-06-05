import { useDeferredValue, useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Page } from "@/components/Page.tsx";
import ItemCard from "@/components/ItemCard";
import { useCatalogue } from "@/api/queries/useCatalogue";
import HeaderWithSearch from "@/components/HeaderWithSearch";

import NotFoundImg from "./notFound.svg";
import { useCartStore } from "@/store/cartStore";
import { NavLink } from "react-router";
import { APP_ROUTES } from "@/navigation/routes";

export const HomePage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const deferredInputValue = useDeferredValue(inputValue);

  const { data = [], isLoading } = useCatalogue();

  const cart = useCartStore((state) => state.items);

  const filteredData = deferredInputValue
    ? data?.filter((item) =>
        item.name.toLowerCase().includes(deferredInputValue.toLowerCase()),
      )
    : data;

  return (
    <Page back={false}>
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

        {filteredData?.length === 0 && !isLoading && (
          <motion.div
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 w-full flex flex-col items-center justify-center"
          >
            <img src={NotFoundImg} className="mb-[14px]" />
            <p className="text-[26px] text-foreground font-[600] leading-[32px] self-center mb-[8px]">
              Not Found
            </p>
            <p className="text-[17px] text-[rgba(0, 0, 0, 0.5)] font-[400] leading-[22px] self-center">
              This style doesn’t exist
            </p>
          </motion.div>
        )}

        {filteredData?.length > 0 && (
          <section className="flex-1 flex flex-wrap gap-x-[12px] gap-y-[28px] overflow-y-auto items-list">
            <AnimatePresence>
              {filteredData?.map((item) => (
                <NavLink
                  key={item.id}
                  to={APP_ROUTES.ITEM_DETAILS + "/" + item.id}
                  viewTransition
                  className="relative flex flex-col items-center gap-[8px] w-[calc(50%-6px)]"
                >
                  <ItemCard
                    data={item}
                    isChecked={cart.some((i) => i.id === item.id)}
                  />
                </NavLink>
              ))}
            </AnimatePresence>
          </section>
        )}
      </motion.div>
    </Page>
  );
};
