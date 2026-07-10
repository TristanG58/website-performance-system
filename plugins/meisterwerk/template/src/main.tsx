import { ViteReactSSG } from "vite-react-ssg"

import "./index.css"
import { routes } from "./routes"

// Single entry for both client hydration and static prerender (vite-react-ssg).
// Each route in `routes` is rendered to its own static HTML at build time, then
// hydrated into a smooth client-side SPA — real crawlable URLs + app feel.
export const createRoot = ViteReactSSG({ routes })
