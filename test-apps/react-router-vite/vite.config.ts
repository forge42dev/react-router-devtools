import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterDevTools, defineRdtConfig } from "react-router-devtools"

import inspect from "vite-plugin-inspect"
const config = defineRdtConfig({
  client: {
    enableInspector: true,
    defaultOpen: false,
    position: "top-right",
    requireUrlFlag: false,
    liveUrls: [
      { url: "https://forge42.dev", name: "Production" },
      {
      url: "https://forge42.dev/staging",
      name: "Staging",
    }],
  },
  pluginDir: "./plugins",
  includeInProd: {
    client: true,
    server: true
  },
    // Set this option to true to suppress deprecation warnings
    // suppressDeprecationWarning: true,
  server:  {
    serverTimingThreshold: 250,
  }
});

export default defineConfig({
  plugins: [
    inspect(),
    reactRouterDevTools( config),
    reactRouter(),
    tsconfigPaths()
  ],
  optimizeDeps: {
    exclude: ["react-router-devtools"]
  },
  server: {
    open: true,
    port: 3005,
  },
});
