import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryProvider } from "./app/providers/QueryProvider";
import { Router } from "./app/providers/Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <Router />
    </QueryProvider>
  </React.StrictMode>
);
