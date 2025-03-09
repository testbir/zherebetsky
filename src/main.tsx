import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";  // ✅ Подключаем глобальные стили
import App from "./App.tsx";   // ✅ Основной компонент

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
