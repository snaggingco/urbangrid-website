import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  // Remove the critical CSS skeleton once React mounts so it doesn't flash/replace
  const skeleton = document.getElementById("hero-skeleton");
  if (skeleton) skeleton.remove();
}
createRoot(document.getElementById("root")!).render(<App />);
