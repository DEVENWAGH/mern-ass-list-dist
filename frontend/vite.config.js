import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  define: {
    // Make process.env available for compatibility with some packages
    "process.env": process.env,
  },
  server: {
    port: 5173, // Default development port
    host: true, // Listen on all addresses
  },
});
