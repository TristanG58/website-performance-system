import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { useSiteAnimations } from "@/hooks/use-site-animations"

/**
 * Geteiltes Layout für alle Seiten: Header + <Outlet/> + Footer.
 * Die GSAP-Animationen werden bei jedem Routenwechsel neu initialisiert
 * (dependency = pathname, revertOnUpdate im Hook) — sonst feuern Reveals auf
 * frisch gemounteten Seiten nicht.
 */
export function SiteLayout() {
  const { pathname } = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)

  useSiteAnimations(rootRef, [pathname])

  // Bei Seitenwechsel nach oben scrollen (SPA verhält sich sonst wie ein Anker-Sprung).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <ThemeProvider>
      <div ref={rootRef} id="top" className="min-h-svh bg-background">
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ThemeProvider>
  )
}
