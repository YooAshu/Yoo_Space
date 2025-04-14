import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppProvider from "./context/AppContext.jsx";
import { SocketProvider } from "./context/SoketContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <SocketProvider>
      <StrictMode>
        <ToastContainer position="top-right" autoClose={1500} theme="dark"/>
        <App />
      </StrictMode>
    </SocketProvider>
  </AppProvider>
);
