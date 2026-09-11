import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reset scroll on client-side navigations so pages open at the top. */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}
