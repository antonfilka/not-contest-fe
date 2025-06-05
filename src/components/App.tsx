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
import { useEffect, useMemo } from "react";
import { useSwipeBack } from "@/lib/hooks/UseSwipeBack";

export function App() {
  useSwipeBack();

  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isThemeParamsDark);
  const safeAreaInsets = useSignal(viewport.contentSafeAreaInsets);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(isDark ? "dark" : "light");

    if (miniApp.setHeaderColor.isAvailable()) {
      miniApp.setHeaderColor(isDark ? "#000000" : "#FFFFFF");
    }

    if (miniApp.setBackgroundColor.isAvailable()) {
      miniApp.setBackgroundColor(isDark ? "#000000" : "#FFFFFF");
    }
  }, [isDark]);

  const location = useLocation();
  const navBarIsHidden = location.pathname.includes(APP_ROUTES.ITEM_DETAILS);
  const isMobile =
    lp.tgWebAppPlatform.includes("ios") ||
    lp.tgWebAppPlatform.includes("android");

  return (
    <main
      className={`relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden`}
    >
      <section
        className="fixed w-full flex-1 px-[16px]"
        style={{
          top: isMobile ? safeAreaInsets.top + 50 : safeAreaInsets.top,
          bottom: navBarIsHidden
            ? safeAreaInsets.bottom + 35
            : safeAreaInsets.bottom + 90,
        }}
      >
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </section>
      {!navBarIsHidden && <NavBar />}
    </main>
  );
}
