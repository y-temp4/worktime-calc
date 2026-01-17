import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TimeDurationCalculator from "./TimeDurationCalculator.tsx";
import { navigate, usePathname } from "./router";

const normalizePath = (pathname: string) => {
  if (pathname === "/" || pathname === "/worktime-calc") {
    return "/worktime-calc/";
  }
  if (pathname === "/worktime-calc/en/") {
    return "/worktime-calc/en";
  }
  if (pathname.startsWith("/worktime-calc/en")) {
    return pathname;
  }
  if (pathname.startsWith("/worktime-calc/")) {
    return "/worktime-calc/";
  }
  return "/worktime-calc/";
};

const App = () => {
  const pathname = usePathname();

  useEffect(() => {
    const normalized = normalizePath(pathname);
    if (normalized !== pathname) {
      navigate(normalized, { replace: true });
    }
  }, [pathname]);

  return <TimeDurationCalculator />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
