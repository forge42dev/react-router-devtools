import { reactRouter as remix } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools, defineRdtConfig } from "remix-development-tools"

const config = defineRdtConfig({
  client: {
    defaultOpen: false,
    panelLocation: "top",
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
  includeInProd: true,
  server:  {
    serverTimingThreshold: 250
  }
});

export default defineConfig({
  plugins: [
    remixDevTools( config),
    remix({

    }),
    tsconfigPaths()
  ],
  server: {
    open: true,
    port: 3005 ,
  },
});