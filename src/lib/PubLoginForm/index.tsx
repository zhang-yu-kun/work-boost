import { Button } from "antd";
import React, { useState } from "react";

export default function PubLoginForm() {
  const [login, setLogin] = useState(true);

  const LoginForm = ({ setLogin }) => {
    return (
      <div>
        <Button>注册</Button>
      </div>
    );
  };

  const Regiser = ({ setLogin }) => {
    return <div></div>;
  };
  return login ? (
    <LoginForm setLogin={setLogin} />
  ) : (
    <Regiser setLogin={setLogin} />
  );
}
