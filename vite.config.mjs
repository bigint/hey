import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/src/components/Shared/UI/")) {
            return "shared-ui";
          }
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  preview: { allowedHosts: true }
});
