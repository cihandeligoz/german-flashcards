/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The AI endpoint (MaibornWolff aikeys) is an OpenAI-compatible LiteLLM proxy.
// We proxy browser requests through the Vite dev server so the API key stays
// server-side (never shipped to the client) and we avoid CORS issues.
const AI_UPSTREAM = "https://aikeys.maibornwolff.de";

export default defineConfig(({ mode }) => {
  // Load .env vars WITHOUT the VITE_ prefix restriction so we can read the secret key.
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.AI_API_KEY ?? "";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api/ai": {
          target: AI_UPSTREAM,
          changeOrigin: true,
          secure: true,
          // /api/ai/chat/completions -> /v1/chat/completions
          rewrite: (path) => path.replace(/^\/api\/ai/, "/v1"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader("Authorization", `Bearer ${apiKey}`);
              }
            });
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: false,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/**/*.test.{ts,tsx}",
          "src/**/index.ts",
          "src/test/**",
          "src/main.tsx",
          "src/vite-env.d.ts",
        ],
      },
    },
  };
});
