import { resolve } from "node:path";
import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersProject(() => {
  return {
    test: {
      coverage: {
        reporter: ["text"], // you can add 'html' and/or 'json' for additional formats
      },
      poolOptions: {
        workers: { wrangler: { configPath: "./wrangler.jsonc" } },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
