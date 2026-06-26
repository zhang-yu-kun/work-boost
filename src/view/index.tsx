import React from "react";
import { createRoot } from "react-dom/client";
import { PubLoginForm } from "../index";

const App = () => {
  return (
    <>
      <PubLoginForm
        theme="techno"
        signInContent={[
          { label: "用户名", field: "username", type: "input" },
          { label: "密码", field: "password", type: "password" },
        ]}
        signUpContent={[
          { label: "用户名", field: "username", type: "input" },
          { label: "密码", field: "password", type: "password" },
          { label: "确认密码", field: "confirmPassword", type: "password" },
        ]}
        onSubmit={() => {}}
        onForgetPassword={() => {}}
      />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
