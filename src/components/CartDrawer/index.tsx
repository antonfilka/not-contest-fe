import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import IconButton from "../IconButton";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./components/CartItem";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { AnimatePresence, motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";

interface CartDrawerProps extends React.PropsWithChildren {}

const HAPTIC_FORCE = "medium";

const CartDrawer: React.FC<CartDrawerProps> = (props) => {
  const [calculatedHeight, setCalculatedHeight] = useState<number | "auto">(
    "auto",
  );
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [tonConnectUI, setOptions] = useTonConnectUI();

  console.log(tonConnectUI);

  const cart = useCartStore((state) => state.items);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);

  const onDecrementQuantityClick = useCallback((id: number) => {
    decrementQuantity(Number(id));
    hapticFeedback.isSupported() && hapticFeedback.impactOccurred(HAPTIC_FORCE);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === contentRef.current) {
          setCalculatedHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  const cartIsEmpty = cart.length === 0;
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent>
        <div
          ref={contentRef}
          className="relative transition-all duration-200 w-full max-w-md mx-auto bg-background mb-[25px]"
          style={{ height: calculatedHeight }}
        >
          <DrawerClose asChild className="absolute top-[8px] right-0">
            <IconButton icon="close" />
          </DrawerClose>

          <AnimatePresence mode="wait">
            {!cartIsEmpty ? (
              <div
                key="cart-items"
                className="w-full flex flex-col transition-all duration-200 "
              >
                <p className="text-foreground text-center text-[20px] leading-[24px] font-[600] mt-[10px]">
                  Cart
                </p>
                <div className="w-full py-[16px] flex flex-col gap-[4px] justify-start">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <CartItem
                          id={item.id}
                          image={item.images[0]}
                          name={item.name}
                          type={item.category}
                          price={item.price}
                          currency={item.currency}
                          quantity={item.quantity}
                          onDecrementClick={onDecrementQuantityClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.div
                key="empty-cart"
                layout
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-[228px] flex flex-col items-center justify-center gap-[8px]"
              >
                <p className="text-foreground text-[26px] leading-[32px] font-[600]">
                  Cart’s cold
                </p>
                <p className="text-[17px] leading-[22px] font-[400] text-[rgba(255, 255, 255, 0.5)]">
                  No items yet
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <DrawerFooter>
            {cartIsEmpty && (
              <DrawerClose className="w-full h-[58px]">
                <Button className="w-full bg-foreground text-background font-[600] text-[17px] rounded-[12px] h-[50px]">
                  OK
                </Button>
              </DrawerClose>
            )}

            {!cartIsEmpty && (
              <Button
                className="w-full bg-foreground text-background font-[600] text-[17px] rounded-[12px] h-[50px]"
                onClick={() =>
                  tonConnectUI.openSingleWalletModal("adsfasdfasdfq4534f3234d")
                }
              >
                <span>Buy for</span>
                <NumberFlow
                  className="text-center mb-[0px] mx-[-2px]"
                  value={totalPrice}
                  spinTiming={{ duration: 200 }}
                  format={{
                    localeMatcher: "best fit",
                  }}
                />
                <span>NOT</span>
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
