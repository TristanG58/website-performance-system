import type { RouteRecord } from "vite-react-ssg"

import { SiteLayout } from "@/components/site/site-layout"
import HomePage from "@/pages/Home"
import LeistungenPage from "@/pages/Leistungen"
import ProjektePage from "@/pages/Projekte"
import UeberUnsPage from "@/pages/UeberUns"
import KontaktPage from "@/pages/Kontakt"

/**
 * MEISTERWERK MULTI-PAGE ROUTES — max. 5 Seiten.
 * Layout (Header/Footer/Animationen) liegt in SiteLayout und umschließt alle
 * Seiten via <Outlet />. Neue Seite = Eintrag hier + Pfad in
 * vite.config.ts -> ssgOptions.includedRoutes + Sitemap (public/sitemap.xml).
 */
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "leistungen", element: <LeistungenPage /> },
      { path: "projekte", element: <ProjektePage /> },
      { path: "ueber-uns", element: <UeberUnsPage /> },
      { path: "kontakt", element: <KontaktPage /> },
      { path: "*", element: <HomePage /> },
    ],
  },
]
