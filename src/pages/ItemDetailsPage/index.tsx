import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { Page } from "@/components/Page.tsx";
import { useParams } from "react-router";
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
import useAppViewportSize from "@/hooks/useAppViewportSize";
import useEmblaCarousel from "embla-carousel-react";
import useMockPayment from "@/hooks/useMockPayment";
import SpottyNotification from "@/components/SpottyNotification";
import { useSpottyNotification } from "@/hooks/useSpottyNotification";
import useHaptic from "@/hooks/useHaptic";
import { useSwipeable } from "react-swipeable";

export const ItemDetailsPage: FC = () => {
  const { width } = useAppViewportSize();
  const { mediumHaptic, lightHaptic } = useHaptic();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const params = useParams();

  const { openConnectWalletModal, wallet } = useMockPayment();

  const { visible, type, triggerNotification } = useSpottyNotification();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: false,
  });

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
    () => cart.find((i) => i.id === Number(params.id))?.quantity || 0,
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
      mediumHaptic();
    }
  }, [currentItem]);

  const onIncrementQuantityClick = useCallback(() => {
    if (currentItem && Number(quantity) !== Number(currentItem.left)) {
      incrementQuantity(Number(params.id));
      mediumHaptic();
    }
  }, [currentItem, quantity]);

  const onDecrementQuantityClick = useCallback(() => {
    if (currentItem) {
      decrementQuantity(Number(params.id));
      mediumHaptic();
    }
  }, [currentItem]);

  const onImageClick = useCallback(
    (index: number) => {
      setActivePhotoIndex(index);
      emblaApi?.scrollTo(index - 1, false);
    },
    [emblaApi],
  );

  const handleBuyNowClick = useCallback(() => {
    if (!isInCart) onAddToCartClick();

    lightHaptic();
  }, [isInCart, onAddToCartClick]);

  const onShareClick = useCallback(() => {
    if (shareURL.isAvailable() && !isLoading) {
      shareURL(
        `Nothing store - t.me/AntonF_contest_notcoin_bot/store`,
        `Look at this "${currentItem?.name}" ${currentItem?.category}`,
      );
    }
  }, []);

  const prevQuantityRef = useRef(quantity);
  useEffect(() => {
    if (prevQuantityRef.current < 8 && quantity === 8) {
      triggerNotification("spotty");
    }
    prevQuantityRef.current = quantity;
  }, [quantity]);

  const slidesPerView = (width - 32 - 16) / 100;
  const slideStyle = {
    flex: `0 0 calc(100% / ${slidesPerView})`,
    maxWidth: "100px",
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!currentItem?.images) return;
      if (activePhotoIndex + 1 < currentItem.images.length)
        onImageClick(activePhotoIndex + 1);
    },
    onSwipedRight: () => {
      if (activePhotoIndex > 0) onImageClick(activePhotoIndex - 1);
    },
    preventScrollOnSwipe: true,
    trackMouse: true, // also allows desktop dragging
  });

  return (
    <Page back={true}>
      {isLoading && (
        <div className="h-full flex flex-1 items-center justify-center py-20">
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
          <div className="w-full min-h-[60px] flex items-center justify-between px-[16px]">
            <h4 className="text-[26px] font-[600]">{currentItem?.name}</h4>
            <IconButton
              icon="share"
              disabled={isLoading}
              onClick={onShareClick}
            />
          </div>
          {/* Description */}
          <div className="min-h-[44px] w-full flex items-center px-[16px]">
            <p>{currentItem?.description}</p>
          </div>
          {/* Tags */}
          <div className="min-h-[54px] w-full flex items-center gap-[8px] px-[16px]">
            <Tag
              value={formatWithThousandDots(currentItem?.price || 0) + " $NOT"}
            />
            <Tag value={currentItem?.left + " LEFT"} />
            {Object.entries(currentItem?.tags || {}).map(([type, value]) => (
              <Tag key={type} value={value.toLocaleUpperCase()} />
            ))}
          </div>
          <div className="relative flex-1 rounded-[20px] overflow-hidden px-[16px]">
            {/* Scrollable image content */}
            <div
              {...handlers}
              className="relative w-full h-full overflow-y-auto rounded-[20px] z-0"
            >
              <img
                src={currentItem?.images[activePhotoIndex]}
                alt={currentItem?.name}
                className="w-full rounded-[20px]"
              />
            </div>
          </div>
          <div
            className="w-full h-[116px] flex items-center overflow-hidden pl-[16px]"
            ref={emblaRef}
          >
            <div className="flex gap-[8px]">
              {currentItem?.images.map((image, index) => (
                <div key={image} style={slideStyle}>
                  <img
                    src={image}
                    onClick={() => onImageClick(index)}
                    className={`w-[100px] h-[100px] object-cover rounded-[16px] box-border border cursor-pointer ${
                      index === activePhotoIndex
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {!isInStock && (
            <div className="min-h-[58px] flex gap-[12px] items-end mt-auto px-[16px]">
              <Button className="flex-1 text-foreground bg-secondary" disabled>
                Out of nothing
              </Button>
            </div>
          )}

          {isInStock && (
            <div className="relative min-h-[58px] flex gap-[12px] items-end mt-auto px-[16px]">
              <SpottyNotification visible={visible} type={type} />
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
                    onClick={handleBuyNowClick}
                  >
                    Buy now
                  </Button>
                </CartDrawer>
              )}
              {!wallet && (
                <Button
                  className="flex-1 bg-foreground text-background"
                  disabled={currentItem?.left === 0}
                  onClick={openConnectWalletModal}
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
