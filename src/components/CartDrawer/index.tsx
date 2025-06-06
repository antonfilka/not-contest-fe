import React, { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
import { useAppStore } from "@/store/appStore";
import { getCartIsEmpty, getTotalPrice } from "@/lib/cartOperations";

interface CartDrawerProps extends React.PropsWithChildren {}

const HAPTIC_FORCE = "medium";

const CartDrawer: React.FC<CartDrawerProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [openedEmpty, setOpenedEmpty] = useState(true);

  const paymentStatus = useAppStore((state) => state.paymentStatus);
  const setPaymentStatus = useAppStore((state) => state.setPaymentStatus);

  const cart = useCartStore((state) => state.items);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);

  const cartIsEmpty = getCartIsEmpty(cart);
  const totalPrice = getTotalPrice(cart);

  const onDecrementQuantityClick = useCallback((id: number) => {
    decrementQuantity(Number(id));
    hapticFeedback.isSupported() && hapticFeedback.impactOccurred(HAPTIC_FORCE);
  }, []);

  useEffect(() => {
    setOpenedEmpty(cartIsEmpty);
  }, []);

  useEffect(() => {
    if (paymentStatus === "success" || paymentStatus === "error") {
      setOpen(false);
    }
  }, [paymentStatus]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent>
        <div
          className="relative transition-all duration-200 delay-300 w-full max-w-md mx-auto bg-background mb-[25px]"
          style={{
            height: cart.length > 0 ? 116 + cart.length * 72 + "px" : "320px",
          }}
        >
          <DrawerClose asChild className="absolute top-[8px] right-0">
            <IconButton icon="close" />
          </DrawerClose>

          <AnimatePresence mode="popLayout">
            {!cartIsEmpty ? (
              <div
                key="cart-items"
                className="w-full min-h-full flex flex-col transition-all duration-200 "
              >
                <p className="text-foreground text-center text-[20px] leading-[24px] font-[600] mt-[10px]">
                  Cart
                </p>
                <div className="w-full min-h-full py-[16px] flex flex-col gap-[4px] justify-start">
                  <AnimatePresence initial={false} mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        exit={{ x: -130, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeIn" }}
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
                transition={{ duration: 0.3, delay: openedEmpty ? 0 : 0.4 }}
                className="h-[228px] flex flex-col items-center justify-center gap-[8px]"
              >
                <p className="text-foreground text-[26px] leading-[32px] font-[600]">
                  Cart’s cold
                </p>
                <p className="text-[17px] leading-[22px] font-[400] text-black dark:text-white opacity-50 ">
                  No items yet
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <DrawerFooter className="fixed bottom-[35px] left-[16px] right-[16px]">
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
                onClick={() => setPaymentStatus("pending")}
                disabled={paymentStatus === "pending"}
              >
                {paymentStatus !== "pending" && (
                  <>
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
                  </>
                )}
                {paymentStatus === "pending" && (
                  <>
                    Waiting for payment (demo)
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin animation-duration-[600ms]" />
                  </>
                )}
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
