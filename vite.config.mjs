import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/src/components/Shared/UI/")) {
            return "shared-ui";
          }

          if (id.includes("/src/indexer/generated.ts")) {
            return "indexer-generated";
          }

          if (!id.includes("/node_modules/")) {
            return;
          }

          if (id.includes("/@apollo/") || id.includes("/graphql/")) {
            return "vendor-apollo";
          }

          if (
            id.includes("/@walletconnect/") ||
            id.includes("/@wagmi/") ||
            id.includes("/wagmi/") ||
            id.includes("/viem/") ||
            id.includes("/ox/") ||
            id.includes("/abitype/")
          ) {
            return "vendor-wallet";
          }

          if (
            id.includes("/prosekit/") ||
            id.includes("/@prosekit/") ||
            id.includes("/unified/") ||
            id.includes("/remark-") ||
            id.includes("/rehype-") ||
            id.includes("/mdast-")
          ) {
            return "vendor-editor";
          }

          if (id.includes("/@heroicons/")) {
            return "vendor-icons";
          }

          if (
            id.includes("/@tanstack/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router/") ||
            id.includes("/react/")
          ) {
            return "vendor-react";
          }

          return "vendor";
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  preview: { allowedHosts: true }
});
