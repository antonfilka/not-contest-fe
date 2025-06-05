import { useCallback, useMemo, useState, type FC } from "react";

import { Page } from "@/components/Page.tsx";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useCatalogue } from "@/api/queries/useCatalogue";
import IconButton from "@/components/IconButton";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { hapticFeedback, shareURL } from "@telegram-apps/sdk-react";
import { useCartStore } from "@/store/cartStore";
import NumberFlow from "@number-flow/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatWithThousandDots } from "@/lib/utils";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

const HAPTIC_FORCE = "medium";

export const ItemDetailsPage: FC = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const params = useParams();

  const wallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const { data = [], isLoading } = useCatalogue();

  const addToCart = useCartStore((state) => state.addToCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const cart = useCartStore((state) => state.items);

  const isInCart = useMemo(
    () => cart.some((i) => i.id === Number(params.id)),
    [cart],
  );
  const quantity = useMemo(
    () => cart.find((i) => i.id === Number(params.id))?.quantity,
    [cart],
  );

  const currentItem = useMemo(
    () => data.find((i) => i.id === Number(params.id)),
    [data],
  );

  const isInStock = useMemo(
    () => !!currentItem?.left && currentItem?.left > 0,
    [currentItem],
  );

  const onAddToCartClick = useCallback(() => {
    if (currentItem) {
      addToCart(currentItem);
      hapticFeedback.isSupported() &&
        hapticFeedback.impactOccurred(HAPTIC_FORCE);
    }
  }, [currentItem]);

  const onIncrementQuantityClick = useCallback(() => {
    if (currentItem && Number(quantity) !== Number(currentItem.left)) {
      incrementQuantity(Number(params.id));

      hapticFeedback.isSupported() &&
        hapticFeedback.impactOccurred(HAPTIC_FORCE);
    }
  }, [currentItem, quantity]);

  const onDecrementQuantityClick = useCallback(() => {
    if (currentItem) {
      decrementQuantity(Number(params.id));
      hapticFeedback.isSupported() &&
        hapticFeedback.impactOccurred(HAPTIC_FORCE);
    }
  }, [currentItem]);

  const onImageClick = useCallback((index: number) => {
    setActivePhotoIndex(index);
  }, []);

  const onShareClick = useCallback(() => {
    if (shareURL.isAvailable() && !isLoading) {
      shareURL(
        `Nothing store - t.me/AntonF_contest_notcoin_bot/store`,
        `Look at this "${currentItem?.name}" ${currentItem?.category}`,
      );
    }
  }, []);

  return (
    <Page back={true}>
      {isLoading && (
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!isLoading && (
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
          {/* Header */}
          <div className="w-full min-h-[60px] flex items-center justify-between">
            <h4 className="text-[26px] font-[600]">{currentItem?.name}</h4>
            <IconButton
              icon="share"
              disabled={isLoading}
              onClick={onShareClick}
            />
          </div>
          {/* Description */}
          <div className="min-h-[44px] w-full flex items-center">
            <p>{currentItem?.description}</p>
          </div>
          {/* Tags */}
          <div className="min-h-[54px] w-full flex items-center gap-[8px]">
            <Tag
              value={formatWithThousandDots(currentItem?.price || 0) + " $NOT"}
            />
            <Tag value={currentItem?.left + " LEFT"} />
            {Object.entries(currentItem?.tags || {}).map(([type, value]) => (
              <Tag key={type} value={value.toLocaleUpperCase()} />
            ))}
          </div>
          <div className="flex-1 item-details rounded-[20px] overflow-y-auto">
            <img
              src={currentItem?.images[activePhotoIndex]}
              alt={currentItem?.name}
              className="w-full rounded-[20px]"
            />
          </div>
          <div className="w-full h-[116px] flex items-center">
            <Swiper
              spaceBetween={8}
              slidesPerView={(window.innerWidth - 32 - 16) / 100}
              modules={[A11y]}
              className="relative"
            >
              {currentItem?.images.map((image, index) => (
                <SwiperSlide key={image}>
                  <img
                    src={image}
                    onClick={() => onImageClick(index)}
                    className={`w-[100px] h-[100px] object-cover rounded-[16px] box-border border cursor-pointer ${
                      index === activePhotoIndex
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {!isInStock && (
            <div className="min-h-[58px] flex gap-[12px] items-end mt-auto">
              <Button className="flex-1 text-foreground bg-secondary" disabled>
                Out of stock
              </Button>
            </div>
          )}

          {isInStock && (
            <div className="min-h-[58px] flex gap-[12px] items-end mt-auto">
              <AnimatePresence mode="wait" initial={false}>
                {isInCart ? (
                  <motion.div
                    key="in-cart"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="relative flex-1 h-[50px] rounded-[12px] text-foreground bg-secondary flex items-center justify-center gap-[17px] cursor-pointer"
                  >
                    <div
                      className="absolute top-0 left-0 h-full w-[50%] z-50"
                      onClick={onDecrementQuantityClick}
                    />
                    <div
                      className="absolute top-0 right-0 h-full w-[50%] z-50"
                      onClick={onIncrementQuantityClick}
                    />
                    <IconButton icon="minus" />
                    <NumberFlow
                      className="text-[20px] font-[600] leading-[24px] w-[44px] text-center"
                      value={quantity || 0}
                      spinTiming={{ duration: 200 }}
                    />
                    <IconButton
                      icon="plus"
                      disabled={
                        Number(quantity) === Number(currentItem?.left || 0)
                      }
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="add-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1"
                  >
                    <Button
                      className="w-full text-foreground bg-secondary"
                      disabled={currentItem?.left === 0}
                      onClick={onAddToCartClick}
                    >
                      Add to cart
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {wallet && (
                <CartDrawer>
                  <Button
                    className="flex-1 bg-foreground text-background"
                    disabled={currentItem?.left === 0}
                  >
                    Buy now
                  </Button>
                </CartDrawer>
              )}
              {!wallet && (
                <Button
                  className="flex-1 bg-foreground text-background"
                  disabled={currentItem?.left === 0}
                  onClick={() => tonConnectUI.openModal()}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </Page>
  );
};
