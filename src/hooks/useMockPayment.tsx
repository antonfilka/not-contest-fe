import { useAppStore } from "@/store/appStore";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

const useMockPayment = () => {
  const paymentStatus = useAppStore((state) => state.paymentStatus);
  const setPaymentStatus = useAppStore((state) => state.setPaymentStatus);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (paymentStatus === "pending") {
      setTimeout(() => {
        setPaymentStatus("success");
        clearCart();
      }, 3500);
    }
  }, [paymentStatus]);
};

export default useMockPayment;
