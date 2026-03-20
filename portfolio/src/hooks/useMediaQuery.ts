import { useState, useEffect } from "react"

/**
 * Hook that returns whether a media query matches.
 * Uses matchMedia API for performance (no resize listener).
 *
 * @param query - Media query string (e.g., "(min-width: 1024px)")
 * @returns boolean - Whether the query matches
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1024px)")
 */
export function useMediaQuery(query: string): boolean {
  // Default to false to avoid hydration mismatch
  // Will update in useEffect after mount
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Handler for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern API (addEventListener)
    mediaQuery.addEventListener("change", handler)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}

/**
 * Convenience hook for desktop detection.
 * Returns true for viewports >= 1024px (lg breakpoint).
 */
export function useIsDesktop(breakpoint: "sm" | "md" | "lg" | "xl" | "2xl" = "lg"): boolean {
  const breakpoints: Record<string, string> = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  }
  return useMediaQuery(breakpoints[breakpoint])
}
