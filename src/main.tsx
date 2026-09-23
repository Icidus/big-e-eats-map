import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initializeAnalytics } from "./features/analytics/analytics";
import "./index.css";

initializeAnalytics("G-MQS9KNPJZR");

createRoot(document.getElementById("root")!).render(<App />);
