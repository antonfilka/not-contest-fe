import { useMemo } from "react";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";
import {
  retrieveLaunchParams,
  useSignal,
  viewport,
  isThemeParamsDark,
} from "@telegram-apps/sdk-react";

import { routes } from "@/navigation/routes.tsx";

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isThemeParamsDark);
  const safeAreaInsets = useSignal(viewport.contentSafeAreaInsets);

  console.log(isDark);

  return (
    <main
      style={{
        paddingBottom: safeAreaInsets.bottom,
      }}
      className={`relative ${isDark ? "dark" : "light"} min-h-screen bg-background text-foreground font-sf-pro flex flex-col overflow-hidden`}
    >
      <section
        className="fixed w-full flex-1 px-[16px]"
        style={{
          top: safeAreaInsets.top + 46,
          bottom: safeAreaInsets.bottom + 49,
        }}
      >
        <HashRouter>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </section>
      <nav className="fixed bottom-0 w-full h-[49px] flex items-center justify-center ">
        <button>1</button>
        <button>2</button>
      </nav>
    </main>
  );
}
