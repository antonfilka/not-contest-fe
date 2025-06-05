import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": ['"SF Pro"', "ui-sans-serif", "system-ui"],
      },

      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease",
      },
    },
  },
  plugins: [],
};
export default config;
