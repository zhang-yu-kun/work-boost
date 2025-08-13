import { useMemo, useState } from "react";
import { PubLoginFormIF } from "../../common/types";
import style from "./index.module.less";
import classNames from "classnames";
import { Form, Button, ConfigProvider, Input } from "antd";
import { btn_color_map } from "../../common/constant";

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const PubLoginForm: React.FC<PubLoginFormIF> = ({
  form,
  theme,
  signInConent,
  signUpContent,
  onSubmit,
  onForgetPassword,
}) => {
  const [activePanel, setActivePanel] = useState(false);

  // 切换注册登录面板的逻辑
  const handleClick = (value: boolean) => {
    setActivePanel(value);
    form.resetFields();
  };

  const rightActiveClass = classNames(style.container, {
    [style.rightPanelActive]: activePanel,
  });

  const overlayStyle = useMemo(
    () =>
      classNames(style.overlay, {
        [style.overlayTechno]: theme === "techno",
        [style.overlayNatural]: theme === "natural",
        [style.overlayFire]: theme === "fire",
      }),
    [theme]
  );

  const Btn = ({
    children,
    type,
    htmltype = "button",
    onClick,
  }: {
    children: React.ReactNode;
    type: "ghost" | PubLoginFormIF["theme"];
    htmltype?: "button" | "submit" | undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  }) => {
    return (
      <ConfigProvider
        theme={{
          components: {
            Button: {
              /* 这里是你的组件 token */
              defaultBg: btn_color_map[type].bg,
              defaultActiveBg: btn_color_map[type].bg,
              defaultBorderColor: btn_color_map[type].border,
              defaultHoverBg: btn_color_map[type].hover,
              defaultColor: btn_color_map[type].text,
              defaultActiveColor: btn_color_map[type].text,
              defaultHoverColor: btn_color_map[type].text,
              defaultHoverBorderColor: btn_color_map[type].border,
              defaultActiveBorderColor: btn_color_map[type].border,
              textTextActiveColor: btn_color_map[type].text,
              textTextColor: btn_color_map[type].text,
              textTextHoverColor: btn_color_map[type].text,
            },
          },
        }}
      >
        <Button className={style.Btn} htmlType={htmltype} onClick={onClick}>
          {children}
        </Button>
      </ConfigProvider>
    );
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            activeBg: "transparent",
            activeBorderColor: "#E5E5E5",
            activeShadow: "0 0 0 2px #bebebe30",
            hoverBorderColor: "#E5E5E5",
          },
        },
      }}
    >
      <div className={style.loginTechno}>
        <div className={rightActiveClass}>
          <Form
            form={form}
            name="signUp"
            className={style.signUp}
            onFinish={onSubmit}
          >
            {" "}
            <p className={style.title}>注册</p>
            <div>
              {signUpContent?.map((item: { label: string; field: string }) => (
                <Form.Item name={item.field} key={item.field}>
                  <Input placeholder={item.label} />
                </Form.Item>
              ))}
            </div>
            <div style={{ width: "100%", flexDirection: "column", ...center }}>
              <Btn type={theme} htmltype="submit">
                注册
              </Btn>
            </div>
          </Form>
          <Form
            form={form}
            name="sigIn"
            className={style.signIn}
            onFinish={onSubmit}
          >
            {" "}
            <p className={style.title}>登录</p>
            <div>
              {signInConent?.map((item: { label: string; field: string }) => (
                <Form.Item name={item.field} key={item.field}>
                  <Input placeholder={item.label} />
                </Form.Item>
              ))}
            </div>
            <div style={{ width: "100%", flexDirection: "column", ...center }}>
              <p
                style={{ margin: "0 0 5px 0", cursor: "pointer" }}
                onClick={onForgetPassword}
              >
                忘记密码
              </p>
              <Btn type={theme} htmltype="submit">
                登录
              </Btn>
            </div>
          </Form>
          <div className={style.overlayContainer}>
            {" "}
            <div className={overlayStyle}>
              {" "}
              <div className={style.overlayLeft}>
                <h1>欢迎回来! </h1>
                <p>已有账号,填写个人信息进行登录</p>
                <Btn type="ghost" onClick={() => handleClick(false)}>
                  去登录!
                </Btn>
              </div>
              <div className={style.overlayRight}>
                <h1>欢迎加入! </h1>
                <p>还未有账号,赶快注册加入我们</p>
                <Btn type="ghost" onClick={() => handleClick(true)}>
                  去注册!
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PubLoginForm;
