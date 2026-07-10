import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import type { RefObject } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * Tech-startup style entrance + scroll-reveal animations, scoped to `scope`.
 * Follows the GSAP React/ScrollTrigger skills:
 * - useGSAP() handles cleanup automatically (reverts tweens + kills ScrollTriggers)
 * - only transform/autoAlpha are animated (compositor-friendly)
 * - ScrollTrigger.batch() staggers elements that enter together
 * - initial "hidden" states are set in JS only, so without motion the page stays visible
 * - gsap.matchMedia() disables everything under prefers-reduced-motion
 */
export function useSiteAnimations(
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header slides in on load.
        gsap.from("[data-anim='header']", {
          y: -24,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform",
        })

        // Hero entrance: staggered copy, then the image, then the floating card.
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.8 },
        })
        tl.from(".hero-item", { y: 24, autoAlpha: 0, stagger: 0.1 })
          .from(
            ".hero-visual",
            { scale: 0.94, autoAlpha: 0, duration: 1 },
            "-=0.55"
          )
          .from(
            ".hero-card",
            { y: 16, scale: 0.9, autoAlpha: 0, ease: "back.out(1.7)" },
            "-=0.5"
          )

        // Subtle parallax on the hero image.
        gsap.to(".hero-visual img", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-visual",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })

        // Scroll reveals: fade-up, staggered per batch that enters together.
        gsap.set(".reveal", { autoAlpha: 0, y: 28 })
        ScrollTrigger.batch(".reveal", {
          start: "top 85%",
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: true,
            }),
        })

        // Heading wipe-up: each section heading splits into lines that slide up
        // from behind a mask. SplitText is free since GSAP went 100% free.
        gsap.utils.toArray<HTMLElement>(".split-heading").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.9,
                ease: "power4.out",
                stagger: 0.12,
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              })
            },
          })
        })

        // Testimonial Google stars pop in one by one.
        gsap.utils.toArray<HTMLElement>(".t-stars").forEach((row) => {
          const stars = row.querySelectorAll(".t-star")
          gsap.from(stars, {
            scale: 0,
            autoAlpha: 0,
            transformOrigin: "center",
            duration: 0.4,
            ease: "back.out(2)",
            stagger: 0.08,
            scrollTrigger: { trigger: row, start: "top 90%", once: true },
          })
        })

        // Ablauf "Straße": die gestrichelten Verbinder wandern beim Scrollen
        // von oben nach unten (strokeDashoffset, an den Scroll gekoppelt).
        gsap.utils.toArray<SVGPathElement>(".road-dash").forEach((path) => {
          const seg = path.closest(".road-seg")
          gsap.fromTo(
            path,
            { strokeDashoffset: 0 },
            {
              strokeDashoffset: -180,
              ease: "none",
              scrollTrigger: {
                trigger: seg ?? path,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        })

        // Die Linie selbst "fließt" von Karte zu Karte: die Fortschrittslinie
        // zeichnet sich ein, während der Verbinder durchs Viewport scrollt
        // (pathLength=1 -> strokeDashoffset 1 = leer, 0 = voll gezeichnet).
        gsap.utils.toArray<SVGPathElement>(".road-fill").forEach((path) => {
          const seg = path.closest(".road-seg")
          gsap.fromTo(
            path,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: seg ?? path,
                start: "top 85%",
                end: "bottom 55%",
                scrub: true,
              },
            }
          )
        })

        return () => {
          // matchMedia + useGSAP revert the rest; clear inline states from set().
          gsap.set(".reveal", { clearProps: "all" })
        }
      })

      // Projekte-Bento: dezenter Parallax auf den Bildern (nur Desktop).
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.utils.toArray<HTMLElement>(".bento-img").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            )
          })
        }
      )
    },
    // revertOnUpdate: bei Routenwechsel werden die alten Tweens/ScrollTrigger
    // sauber zurückgesetzt und auf dem neuen Seiten-DOM neu aufgebaut.
    { scope, dependencies: deps, revertOnUpdate: true }
  )
}
