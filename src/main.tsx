import { StrictMode } from "react";
import { Container, createRoot } from "react-dom/client";
import "./index.css";
import "./assets/vendor/bootstrap.min.css";
import App from "./App.jsx";

createRoot(document.getElementById("root") as Container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
