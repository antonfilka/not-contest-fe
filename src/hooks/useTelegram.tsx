import { APP_ROUTES } from "@/navigation/routes";
import {
  isThemeParamsDark,
  miniApp,
  retrieveLaunchParams,
  useSignal,
  viewport,
} from "@telegram-apps/sdk-react";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

const UseTelegram = () => {
  const launchParams = useMemo(() => retrieveLaunchParams(), []);
  const location = useLocation();

  const isDarkTheme = useSignal(isThemeParamsDark);
  const safeInsets = useSignal(viewport.contentSafeAreaInsets);

  const isMobilePlatform = useMemo(() => {
    return (
      launchParams.tgWebAppPlatform.includes("ios") ||
      launchParams.tgWebAppPlatform.includes("android")
    );
  }, [launchParams]);

  // Handle theme change
  useEffect(() => {
    if (location.pathname.includes(APP_ROUTES.GAME)) {
      document.body.classList.remove("light", "dark");
      document.body.classList.add("dark");

      miniApp.setHeaderColor?.("#000000");
      miniApp.setBackgroundColor?.("#000000");

      return;
    }

    document.body.classList.remove("light", "dark");
    document.body.classList.add(isDarkTheme ? "dark" : "light");

    miniApp.setHeaderColor?.(isDarkTheme ? "#000000" : "#FFFFFF");
    miniApp.setBackgroundColor?.(isDarkTheme ? "#000000" : "#FFFFFF");
  }, [isDarkTheme, location]);

  return { isMobilePlatform, isDarkTheme, safeInsets, launchParams };
};

export default UseTelegram;
