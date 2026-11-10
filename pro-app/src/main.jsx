// pro-app/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "../src/context/AuthProvider.jsx";
import Background from "./components/Background.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Background>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </Background>
  </StrictMode>
);
