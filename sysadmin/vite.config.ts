import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5174,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("element-plus")) {
            return "element-plus";
          }

          if (id.includes("vue-router") || id.includes("pinia") || id.includes("/vue/")) {
            return "framework";
          }
        }
      }
    }
  }
});
