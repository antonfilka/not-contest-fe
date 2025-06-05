import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { Root } from "@/components/Root.tsx";
import { EnvUnsupported } from "@/components/EnvUnsupported.tsx";
import { init } from "@/init.ts";

import "./index.css";

// Mock the environment in case, we are outside Telegram.
import "./mockEnv.ts";

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
      <Root />
    </StrictMode>,
  );

  // Revealing Main App after splashscreen
  await sleep(50);
  if (splashscreen) splashscreen.classList.add("hide");
  await sleep(1000);
  splashscreen?.remove();
} catch (e) {
  root.render(<EnvUnsupported />);
  if (splashscreen) splashscreen.classList.add("hide");
}
