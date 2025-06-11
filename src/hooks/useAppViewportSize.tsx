import { useState, useEffect } from "react";

type ScreenSize = {
  width: number;
  height: number;
};

const getSize = (): ScreenSize => ({
  width: window.innerWidth > 600 ? 600 : window.innerWidth,
  height: window.innerHeight,
});

const useAppViewportSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() =>
    typeof window !== "undefined" ? getSize() : { width: 0, height: 0 },
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: screenSize.width,
    height: screenSize.height,
  };
};

export default useAppViewportSize;
