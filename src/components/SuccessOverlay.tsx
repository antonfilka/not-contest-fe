import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Button } from "./ui/button";
import ConfettiImage from "@/assets/confetti.gif";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

const SuccessOverlay = () => {
  const setPaymentStatus = useAppStore((state) => state.setPaymentStatus);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed z-[9999] inset-0 flex flex-col justify-center items-center backdrop-blur-md bg-[rgba(0,0,0,0.5)]"
    >
      <Realistic autorun={{ speed: 0.3, delay: 3 }} />
      <img
        alt="confetti"
        src={ConfettiImage}
        className="w-[320px] h-[320px] mb-[24px]"
      />
      <p className="text-[36px] font-[600] leading-[36px] text-white mb-[12px]">
        You Got It!
      </p>
      <p className="text-[17px] font-[400] leading-[22px] text-white mb-[60px]">
        Your purchase is on the way
      </p>
      <Button
        className="w-[calc(100%-32px)] max-w-[668px] h-[50px] bg-white text-black text-[17px] font-[600]"
        onClick={() => setPaymentStatus("none")}
      >
        Awesome
      </Button>
    </motion.div>
  );
};

export default SuccessOverlay;
