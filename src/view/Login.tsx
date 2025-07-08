import { Form } from "antd";
import PubLoginForm from "../lib/PubLoginForm";
export default function Login() {
  const [form] = Form.useForm();

  const signInConent = [
    { label: "用户名", field: "name" },
    { label: "密码", field: "password" },
  ];
  const signUpContent = [
    { label: "用户名", field: "name" },
    { label: "手机号", field: "phone" },
    { label: "密码", field: "password" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "98vh",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PubLoginForm
        form={form}
        theme="fire"
        signInConent={signInConent}
        signUpContent={signUpContent}
        onSubmit={() => {}}
        onForgetPassword={() => {}}
      />
    </div>
  );
}
