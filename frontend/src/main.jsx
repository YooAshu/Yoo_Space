import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppProvider from "./context/AppContext.jsx";
import { SocketProvider } from "./context/SoketContext.jsx";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <SocketProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SocketProvider>
  </AppProvider>
);
