import { Routes, Route, Navigate, useLocation } from "react-router";
import { APP_ROUTES, routes } from "@/navigation/routes.tsx";
import NavBar from "@/components/NavBar";
import SuccessOverlay from "@/components/SuccessOverlay";
import { useMemo } from "react";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import useSwipeBack from "@/hooks/useSwipeBack";
import useMockPayment from "@/hooks/useMockPayment";
import { AnimatePresence } from "framer-motion";
import useTelegram from "@/hooks/useTelegram";

export function App() {
  const { isMobilePlatform, safeInsets } = useTelegram();
  const isKeyboardOpen = useKeyboardStatus();
  const { paymentStatus } = useMockPayment(); // Mock payments in demo mode
  useSwipeBack();

  const location = useLocation();

  const navBarHidden = useMemo(() => {
    return (
      location.pathname.includes(APP_ROUTES.ITEM_DETAILS) ||
      location.pathname.includes(APP_ROUTES.GAME) ||
      isKeyboardOpen
    );
  }, [location.pathname, isKeyboardOpen]);

  const sectionTop = useMemo(() => {
    return isMobilePlatform ? safeInsets.top + 50 : safeInsets.top;
  }, [isMobilePlatform, safeInsets.top]);

  const sectionBottom = useMemo(() => {
    if (navBarHidden) {
      return isKeyboardOpen ? 0 : safeInsets.bottom + 35;
    }
    return safeInsets.bottom + 90;
  }, [navBarHidden, isKeyboardOpen, isMobilePlatform, safeInsets.bottom]);

  return (
    <main className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden max-w-[600px] mx-auto">
      {/* Success Overlay (payment success) */}
      <AnimatePresence>
        {paymentStatus === "success" && <SuccessOverlay />}
      </AnimatePresence>

      {/* Main content area */}
      <section
        className="absolute w-full flex-1"
        style={{ top: sectionTop, bottom: sectionBottom }}
      >
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </section>

      {/* Bottom Navigation */}
      {!navBarHidden && <NavBar isMobile={isMobilePlatform} />}
    </main>
  );
}
