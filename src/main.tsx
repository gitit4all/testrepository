import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* HashRouter: keine 404-Fehler bei Direktaufrufen auf GitHub Pages */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
