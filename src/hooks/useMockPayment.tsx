import { useAppStore } from "@/store/appStore";
import { useCartStore } from "@/store/cartStore";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useCallback, useEffect } from "react";

const useMockPayment = () => {
  const paymentStatus = useAppStore((state) => state.paymentStatus);
  const setPaymentStatus = useAppStore((state) => state.setPaymentStatus);
  const clearCart = useCartStore((state) => state.clearCart);

  // const wallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  useEffect(() => {
    if (paymentStatus === "pending") {
      setTimeout(() => {
        setPaymentStatus("success");
        clearCart();
      }, 3500);
    }
  }, [paymentStatus]);

  const openConnectWalletModal = useCallback(() => {
    tonConnectUI.openModal();
  }, []);

  const wallet = 1;

  return { paymentStatus, wallet, openConnectWalletModal };
};

export default useMockPayment;
