import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add error boundary for debugging
const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = "<div style='padding: 20px; color: red;'>ERROR: Root element not found</div>";
} else {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("React render error:", error);
    rootElement.innerHTML = `<div style='padding: 20px; color: red;'>React Error: ${error}</div>`;
  }
}
