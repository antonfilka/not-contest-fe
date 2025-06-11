import { hapticFeedback } from "@telegram-apps/sdk-react";

const useHaptic = () => {
  const mediumHaptic = () => {
    hapticFeedback.isSupported() && hapticFeedback.impactOccurred("medium");
  };
  const heavyHaptic = () => {
    hapticFeedback.isSupported() && hapticFeedback.impactOccurred("heavy");
  };
  const lightHaptic = () => {
    hapticFeedback.isSupported() && hapticFeedback.impactOccurred("light");
  };
  const rigidHaptic = () => {
    hapticFeedback.isSupported() && hapticFeedback.impactOccurred("rigid");
  };

  return {
    mediumHaptic,
    heavyHaptic,
    lightHaptic,
    rigidHaptic,
    isHapticSupported: hapticFeedback.isSupported(),
  };
};

export default useHaptic;
