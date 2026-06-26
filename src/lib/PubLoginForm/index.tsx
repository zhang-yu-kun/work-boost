import { forwardRef, useMemo, useImperativeHandle, useState } from "react";
import type {
  PubLoginFormIF,
  PubLoginFormRef,
  SignFieldItem,
  signTy,
} from "../../common/types";
import style from "./index.module.less";
import classNames from "classnames";
import { Form, Button, ConfigProvider, Input, Select } from "antd";
import { btn_color_map } from "../../common/constant";

// 默认邮箱后缀
const defaultEmailSuffixes = [
  "@qq.com",
  "@163.com",
  "@126.com",
  "@gmail.com",
  "@outlook.com",
];

// 字段类型 → 默认校验规则
const rulesMap: Record<signTy, any[] | undefined> = {
  input: undefined,
  password: undefined,
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }],
  email: undefined, // email 校验在 renderFormItem 中特殊处理
};

// 渲染单个表单项，email 类型渲染输入框 + 后缀选择器
const renderFormItem = (item: SignFieldItem) => {
  const suffixKey = `${item.field}_suffix`;

  if (item.type === "email" && !item.component) {
    const suffix = item.suffix ?? defaultEmailSuffixes;
    const emailRules = item.rules ?? [
      ({ getFieldValue }: any) => ({
        validator(_: any, value: string) {
          if (!value) return Promise.resolve();
          const full = `${value}${getFieldValue(suffixKey) || suffix[0]}`;
          return /\S+@\S+\.\S+/.test(full)
            ? Promise.resolve()
            : Promise.reject(new Error("请输入正确的邮箱"));
        },
      }),
    ];
    return (
      <div key={item.field} style={{ display: "flex", gap: 8 }}>
        <Form.Item
          name={item.field}
          rules={emailRules}
          dependencies={[suffixKey]}
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder={item.label} />
        </Form.Item>
        <Form.Item name={suffixKey} initialValue={suffix[0]} noStyle>
          <Select
            style={{ width: 130 }}
            options={suffix.map((s) => ({ label: s, value: s }))}
          />
        </Form.Item>
      </div>
    );
  }

  const componentMap: Record<signTy, React.ReactNode> = {
    input: <Input placeholder={item.label} />,
    password: <Input.Password placeholder={item.label} />,
    phone: <Input placeholder={item.label} />,
    email: <Input placeholder={item.label} />,
  };

  return (
    <Form.Item
      name={item.field}
      key={item.field}
      rules={item.rules ?? rulesMap[item.type]}
    >
      {item.component ?? componentMap[item.type]}
    </Form.Item>
  );
};

// 合并邮箱字段值：将 {field, field_suffix} 拼接为完整邮箱
const mergeEmailValues = (
  values: Record<string, any>,
  content: SignFieldItem[],
) => {
  const merged = { ...values };
  content.forEach((item) => {
    if (item.type === "email" && !item.component) {
      const suffixKey = `${item.field}_suffix`;
      if (merged[item.field] && merged[suffixKey]) {
        merged[item.field] = `${merged[item.field]}${merged[suffixKey]}`;
        delete merged[suffixKey];
      }
    }
  });
  return merged;
};

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const PubLoginForm = forwardRef<PubLoginFormRef, PubLoginFormIF>(
  (
    { theme, signInContent, signUpContent, onSubmit, onForgetPassword },
    ref,
  ) => {
    const [activePanel, setActivePanel] = useState(false);
    const [signInForm] = Form.useForm();
    const [signUpForm] = Form.useForm();

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      switchToLogin: () => setActivePanel(false),
      switchToSignUp: () => setActivePanel(true),
    }));

    // 切换注册登录面板的逻辑
    const handleClick = (toRegister: boolean) => {
      setActivePanel(toRegister);
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
      [theme],
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
              form={signUpForm}
              name="signUp"
              className={style.signUp}
              onFinish={async (v) => {
                await onSubmit(mergeEmailValues(v, signUpContent), "signUp");
                setActivePanel(false);
              }}
            >
              <p className={style.title}>注册</p>
              <div>{signUpContent?.map((item) => renderFormItem(item))}</div>
              <div
                style={{ width: "100%", flexDirection: "column", ...center }}
              >
                <Btn type={theme} htmltype="submit">
                  注册
                </Btn>
              </div>
            </Form>
            <Form
              form={signInForm}
              name="signIn"
              className={style.signIn}
              onFinish={(v) =>
                onSubmit(mergeEmailValues(v, signInContent), "signIn")
              }
            >
              <p className={style.title}>登录</p>
              <div>{signInContent?.map((item) => renderFormItem(item))}</div>
              <div
                style={{ width: "100%", flexDirection: "column", ...center }}
              >
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
              <div className={overlayStyle}>
                <div className={style.overlayLeft}>
                  <p style={{ margin: "20px 0", fontSize: "32px" }}>
                    欢迎回来!
                  </p>
                  <p style={{ margin: "16px 0" }}>
                    已有账号,填写个人信息进行登录
                  </p>

                  <div style={{ marginBottom: 30 }}>
                    <Btn type="ghost" onClick={() => handleClick(false)}>
                      去登录!
                    </Btn>
                  </div>
                </div>
                <div className={style.overlayRight}>
                  <p style={{ margin: "20px 0", fontSize: "32px" }}>
                    欢迎加入!
                  </p>
                  <p style={{ margin: "16px 0" }}>
                    还未有账号,赶快注册加入我们
                  </p>

                  <div style={{ marginBottom: 30 }}>
                    <Btn type="ghost" onClick={() => handleClick(true)}>
                      去注册!
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  },
);

export default PubLoginForm;
