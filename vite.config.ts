import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    process.env.HTTPS && mkcert(),
  ],
  build: {
    target: "esnext",
  },
  publicDir: "./public",
  server: {
    host: true,
    allowedHosts: ["7e6c-34-118-112-64.ngrok-free.app"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
