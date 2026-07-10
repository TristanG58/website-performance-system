/// <reference types="vite-react-ssg" />
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // vite-react-ssg: prerender all 5 routes to static HTML (SEO/GEO-friendly).
  // Keep this list in sync with src/routes.tsx.
  ssgOptions: {
    script: "async",
    formatting: "none",
    includedRoutes() {
      return ["/", "/leistungen", "/projekte", "/ueber-uns", "/kontakt"]
    },
  },
})
