import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <>hello world</>;
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
