import {
  setDebug,
  backButton,
  initData,
  init as initSDK,
  miniApp,
  mockTelegramEnv,
  type ThemeParams,
  themeParamsState,
  retrieveLaunchParams,
  emitEvent,
  viewport,
  closingBehavior,
  themeParams,
  swipeBehavior,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug);
  initSDK();

  // Add Eruda
  options.eruda &&
    void import("eruda").then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: 100 });
    });

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    let firstThemeSent = false;
    mockTelegramEnv({
      onEvent(event, next) {
        if (event[0] === "web_app_request_theme") {
          let tp: ThemeParams = {};
          if (firstThemeSent) {
            tp = themeParamsState();
          } else {
            firstThemeSent = true;
            tp ||= retrieveLaunchParams().tgWebAppThemeParams;
          }
          return emitEvent("theme_changed", { theme_params: tp });
        }

        if (event[0] === "web_app_request_safe_area") {
          return emitEvent("safe_area_changed", {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          });
        }

        next();
      },
    });
  }

  initData.restore();

  // Mount all components used in the project.

  if (backButton.mount.isAvailable()) {
    backButton.mount();
  }

  if (closingBehavior.mount.isAvailable()) {
    closingBehavior.mount();
    closingBehavior.enableConfirmation();
  }

  if (miniApp.mountSync.isAvailable()) {
    miniApp.mountSync();
  }

  if (miniApp.bindCssVars.isAvailable()) {
    miniApp.bindCssVars();
  }

  if (miniApp.setHeaderColor.isAvailable()) {
    miniApp.setHeaderColor("#000000");
  }

  if (miniApp.setBackgroundColor.isAvailable()) {
    miniApp.setBackgroundColor("#000000");
  }

  if (viewport.mount.isAvailable()) {
    await viewport.mount();
  }

  if (viewport.requestFullscreen.isAvailable()) {
    await viewport.requestFullscreen();
  }

  if (viewport.bindCssVars.isAvailable()) {
    viewport.bindCssVars();
  }

  if (themeParams.mountSync.isAvailable()) {
    themeParams.mountSync();
  }

  if (themeParams.bindCssVars.isAvailable()) {
    themeParams.bindCssVars();
  }

  if (swipeBehavior.mount.isAvailable()) {
    swipeBehavior.mount();
  }

  if (swipeBehavior.disableVertical.isAvailable()) {
    swipeBehavior.disableVertical();
  }

  // if (miniApp.ready.isAvailable()) {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  // }

  miniApp.ready();
}
