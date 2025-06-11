import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { RootWithProviders } from "@/app/RootWithProviders.tsx";
import { EnvUnsupported } from "@/app/EnvUnsupported.tsx";
import { init } from "@/app/init.ts";

import "./index.css";

// Mock the environment in case, we are outside Telegram.
import "./app/mockEnv.ts";
import { preloadImages } from "./app/preloadImages.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const root = ReactDOM.createRoot(document.getElementById("root")!);
const splashscreen = document.getElementById("splashscreen");

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || "").includes("platformer_debug") ||
    import.meta.env.DEV;

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ["ios", "android", "macos"].includes(platform),
    mockForMacOS: platform === "macos",
    supportsViewport: platform === "ios" || platform === "android",
  });

  root.render(
    <StrictMode>
      <RootWithProviders />
    </StrictMode>,
  );

  const imagesToPreload = Object.values(
    import.meta.glob("@/assets/**/*.{png,gif,webp}", {
      eager: true,
      as: "url",
    }),
  );
  await preloadImages(imagesToPreload);

  // Revealing Main App after splashscreen
  if (splashscreen) splashscreen.classList.add("hide");
  await sleep(1000);
  splashscreen?.remove();
} catch (e) {
  root.render(<EnvUnsupported />);
  if (splashscreen) splashscreen.classList.add("hide");
}
