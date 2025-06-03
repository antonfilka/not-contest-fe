import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  plugins: [react(), tsconfigPaths(), process.env.HTTPS && mkcert()],
  build: {
    target: "esnext",
  },
  publicDir: "./public",
  server: {
    host: true,
  },
});
