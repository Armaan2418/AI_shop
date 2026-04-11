import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls window to (0, 0) on every route change.
 * Place this inside <BrowserRouter> so it can read useLocation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant scroll — no animation, just snap to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
