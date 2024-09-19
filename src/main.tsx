import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TimeDurationCalculator from "./TimeDurationCalculator.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimeDurationCalculator />
  </StrictMode>
);
