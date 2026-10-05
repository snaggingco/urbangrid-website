import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { captureAttribution } from "./lib/attribution";
import { installContactClickTracking } from "./lib/analytics";
import { preloadPublicRoute } from "./lib/publicRoutePreload";

captureAttribution(true);
const removeContactClickTracking = installContactClickTracking();
if (import.meta.hot) import.meta.hot.dispose(removeContactClickTracking);

const root = createRoot(document.getElementById("root")!);
const routeReady = preloadPublicRoute(window.location.pathname);
function renderApp() {
  // React replaces the first-paint shell atomically during its commit. Never
  // empty it first, or replace it with a public-page authentication spinner.
  root.render(<App />);
}
if (routeReady) {
  routeReady.then(renderApp, error => {
    console.error("Public route could not be loaded", error?.name || "Error");
    renderApp();
  });
} else {
  renderApp();
}
