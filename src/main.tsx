import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import TimeDurationCalculator from "./TimeDurationCalculator.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/worktime-calc/" element={<TimeDurationCalculator />} />
        <Route path="/worktime-calc/en" element={<TimeDurationCalculator />} />
        <Route path="/" element={<Navigate to="/worktime-calc/" replace />} />
        <Route path="*" element={<Navigate to="/worktime-calc/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
