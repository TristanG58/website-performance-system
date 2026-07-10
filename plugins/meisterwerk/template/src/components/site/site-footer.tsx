import { HardHat } from "lucide-react"
import { Link } from "react-router-dom"

import { site } from "@/config/site"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <HardHat className="size-4" />
              </span>
              {site.business.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {site.business.footerTagline}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <div className="font-medium">Leistungen</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {site.footerLinks.leistungen.map((l) => (
                  <li key={l}>
                    <Link to="/leistungen" className="hover:text-foreground">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium">Unternehmen</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><Link to="/ueber-uns" className="hover:text-foreground">Über uns</Link></li>
                <li><Link to="/projekte" className="hover:text-foreground">Projekte</Link></li>
                <li><Link to="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium">Kontakt</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><a href={site.business.phoneHref} className="hover:text-foreground">{site.business.phone}</a></li>
                <li>{site.business.email}</li>
                <li>{site.business.address}</li>
              </ul>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {site.business.name}. Alle Rechte vorbehalten.</span>
          <div className="flex gap-4">
            <a href={site.business.legalLinks.impressum} className="hover:text-foreground">Impressum</a>
            <a href={site.business.legalLinks.datenschutz} className="hover:text-foreground">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
