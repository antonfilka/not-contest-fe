import { useCallback, useState } from "react";

export type SpottyType = "spotty";
// export type SpottyType = "spotty" | "party" | "shocky";

export const useSpottyNotification = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<SpottyType>("spotty");

  const triggerNotification = useCallback((newType: SpottyType) => {
    setType(newType);
    setVisible(true);
    setTimeout(() => setVisible(false), 2300);
  }, []);

  return { visible, type, triggerNotification };
};
