import { Routes, Route, Navigate, useLocation } from "react-router";
import {
  useSignal,
  viewport,
  isThemeParamsDark,
  miniApp,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";
import { APP_ROUTES, routes } from "@/navigation/routes.tsx";
import NavBar from "./NavBar";
import SuccessOverlay from "./SuccessOverlay";
import { useEffect, useMemo } from "react";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import useSwipeBack from "@/hooks/useSwipeBack";
import useMockPayment from "@/hooks/useMockPayment";
import { useAppStore } from "@/store/appStore";
import { AnimatePresence } from "framer-motion";

export function App() {
  // --- Initialization ---
  const launchParams = useMemo(() => retrieveLaunchParams(), []);
  const isDarkTheme = useSignal(isThemeParamsDark);
  const safeInsets = useSignal(viewport.contentSafeAreaInsets);
  const location = useLocation();

  // --- State & Feature Hooks ---
  const paymentStatus = useAppStore((state) => state.paymentStatus);
  const isKeyboardOpen = useKeyboardStatus();
  useSwipeBack();
  useMockPayment(); // Mock payments in demo mode

  // --- Theme and WebApp Styling ---
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(isDarkTheme ? "dark" : "light");

    miniApp.setHeaderColor?.(isDarkTheme ? "#000000" : "#FFFFFF");
    miniApp.setBackgroundColor?.(isDarkTheme ? "#000000" : "#FFFFFF");
  }, [isDarkTheme]);

  // --- Derived UI Logic ---
  const isMobile = useMemo(() => {
    return (
      launchParams.tgWebAppPlatform.includes("ios") ||
      launchParams.tgWebAppPlatform.includes("android")
    );
  }, [launchParams]);

  const navBarHidden = useMemo(() => {
    return (
      location.pathname.includes(APP_ROUTES.ITEM_DETAILS) || isKeyboardOpen
    );
  }, [location.pathname, isKeyboardOpen]);

  const sectionTop = useMemo(() => {
    return isMobile ? safeInsets.top + 50 : safeInsets.top;
  }, [isMobile, safeInsets.top]);

  const sectionBottom = useMemo(() => {
    if (navBarHidden) {
      return isKeyboardOpen ? 0 : safeInsets.bottom + 35;
    }
    return isMobile ? safeInsets.bottom + 90 : safeInsets.bottom + 70;
  }, [navBarHidden, isKeyboardOpen, isMobile, safeInsets.bottom]);

  // --- Render ---
  return (
    <main className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Success Overlay (payment success) */}
      <AnimatePresence>
        {paymentStatus === "success" && <SuccessOverlay />}
      </AnimatePresence>

      {/* Main content area */}
      <section
        className="fixed w-full flex-1 px-[16px]"
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
      {!navBarHidden && <NavBar isMobile={isMobile} />}
    </main>
  );
}
