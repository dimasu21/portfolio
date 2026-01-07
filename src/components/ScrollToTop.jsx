import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that scrolls window to top on every route change
 * Fixes the issue where pages open in the middle instead of at the top
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  // Use useLayoutEffect to prevent scroll flash
  useLayoutEffect(() => {
    // Disable browser's default scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    
    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Some browsers/mobile need a small delay override
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}
