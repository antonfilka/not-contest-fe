import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IconButton from "@/components/IconButton";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useCartStore } from "@/store/cartStore";

const ANIMATION_DURATION = 0.2;

interface HeaderWithSearchProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const HeaderWithSearch = ({
  inputValue,
  setInputValue,
}: HeaderWithSearchProps) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const cart = useCartStore((state) => state.items);
  const cartLength = cart.length;

  const handleSearchClick = useCallback(() => setIsInputVisible(true), []);
  const handleCancelClick = useCallback(() => {
    setIsInputVisible(false);
    setInputValue("");
  }, [setInputValue]);

  return (
    <section className="h-[60px] w-full flex items-center justify-between mb-[8px] gap-[12px] relative">
      <div className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {isInputVisible ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            >
              <Input
                placeholder="Search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onDeleteClick={() => setInputValue("")}
                maxLength={30}
                autoFocus
              />
            </motion.div>
          ) : (
            <motion.h1
              key="title"
              className="text-[26px] font-[600] leading-[32px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            >
              Not Store
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {isInputVisible ? (
            <motion.div
              key="cancel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            >
              <Button
                onClick={handleCancelClick}
                className="text-[18px] font-[400] leading-[24px]"
              >
                Cancel
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="icons"
              className="flex items-center gap-[8px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            >
              <IconButton
                icon="search"
                onClick={handleSearchClick}
                ariaLabel="Search"
              />
              <CartDrawer>
                {cartLength > 0 ? (
                  <div
                    aria-label={`Cart with ${cartLength} items`}
                    className="w-[23px] h-[23px] flex items-center justify-center text-[18px] leading-[24px] font-[700] text-background bg-foreground rounded-full"
                  >
                    {cartLength}
                  </div>
                ) : (
                  <IconButton icon="cart" ariaLabel="Cart" />
                )}
              </CartDrawer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeaderWithSearch;
