import { useEffect } from "react";
import { useNavigate } from "react-router";

function useSwipeBack(edgeWidth = 30, minSwipeDistance = 80) {
  const navigate = useNavigate();

  useEffect(() => {
    let touchStartX: number | null = null;
    let touchEndX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX <= edgeWidth) {
        touchStartX = touch.clientX;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX !== null) {
        touchEndX = e.touches[0].clientX;
      }
    };

    const onTouchEnd = () => {
      if (
        touchStartX !== null &&
        touchEndX !== null &&
        touchEndX - touchStartX > minSwipeDistance
      ) {
        navigate(-1);
      }

      touchStartX = null;
      touchEndX = null;
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [navigate, edgeWidth, minSwipeDistance]);
}

export default useSwipeBack;
