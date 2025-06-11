import { AnimatePresence, motion } from "framer-motion";
import Spotty from "@/assets/spotty.png";
import { SpottyType } from "@/hooks/useSpottyNotification";

const imageMap: Record<SpottyType, string> = {
  spotty: Spotty,
};

interface Props {
  visible: boolean;
  type: SpottyType;
}

const SpottyNotification: React.FC<Props> = ({ visible, type }) => {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Dimmed background – does not block pointer events */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Centered image – also non-blocking */}
          <motion.img
            src={imageMap[type]}
            alt={type}
            className="fixed z-[101] left-1/2 top-1/2 w-[230px] h-[230px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SpottyNotification;
