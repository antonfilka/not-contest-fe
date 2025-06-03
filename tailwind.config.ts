import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": ['"SF Pro"', "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        title: [
          "26px",
          {
            lineHeight: "32px",
            letterSpacing: "0.38px",
          },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
