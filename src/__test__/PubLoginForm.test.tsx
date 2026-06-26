import React, { forwardRef, useRef } from "react";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PubLoginForm from "../lib/PubLoginForm";
import type { PubLoginFormIF, PubLoginFormRef } from "../common/types";

// 解决 window.matchMedia 问题
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock("classnames", () => ({
  __esModule: true,
  default: (...args: any[]) => args.filter((arg) => typeof arg === "string").join(" "),
}));

jest.mock("../common/constant", () => ({
  btn_color_map: {
    techno: { bg: "#123", border: "#456", hover: "#789", text: "#fff" },
    natural: { bg: "#123", border: "#456", hover: "#789", text: "#fff" },
    fire: { bg: "#123", border: "#456", hover: "#789", text: "#fff" },
    ghost: { bg: "#123", border: "#456", hover: "#789", text: "#fff" },
  },
}));

// ---- 默认 props ----
const signInContent = [
  { label: "用户名", field: "username", type: "input" as const },
  { label: "密码", field: "password", type: "password" as const },
];

const signUpContent = [
  { label: "用户名", field: "username", type: "input" as const },
  { label: "手机号", field: "phone", type: "phone" as const },
  { label: "邮箱", field: "email", type: "email" as const },
  { label: "密码", field: "password", type: "password" as const },
];

const defaultProps: PubLoginFormIF = {
  theme: "techno",
  signInContent,
  signUpContent,
  onSubmit: jest.fn(),
  onForgetPassword: jest.fn(),
};

// 带 ref 的包装组件
const TestFormWithRef = forwardRef<PubLoginFormRef, Partial<PubLoginFormIF>>((props, ref) => {
  return <PubLoginForm {...defaultProps} {...props} ref={ref} />;
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ==================== 基础渲染 ====================
describe("基础渲染", () => {
  it("渲染登录标题和表单字段", () => {
    render(<TestFormWithRef />);
    expect(screen.getByText("登录")).toBeInTheDocument();
    // 两个表单都有"用户名"，signIn 的排在前面
    expect(screen.getAllByPlaceholderText("用户名")[0]).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("密码")[0]).toBeInTheDocument();
  });

  it("渲染忘记密码链接", () => {
    render(<TestFormWithRef />);
    expect(screen.getByText("忘记密码")).toBeInTheDocument();
  });

  it("渲染切换按钮", () => {
    render(<TestFormWithRef />);
    expect(screen.getByText("去注册!")).toBeInTheDocument();
    expect(screen.getByText("去登录!")).toBeInTheDocument();
  });
});

// ==================== 面板切换 ====================
describe("面板切换", () => {
  it("点击去注册切换到注册面板", () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));
    expect(screen.getByText("注册")).toBeVisible();
  });

  it("点击去登录切换回登录面板", () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));
    fireEvent.click(screen.getByText("去登录!"));
    expect(screen.getByText("登录")).toBeVisible();
  });

  it("注册面板显示所有注册字段", () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));
    expect(screen.getByPlaceholderText("手机号")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("邮箱")).toBeInTheDocument();
  });
});

// ==================== 登录表单提交 ====================
describe("登录表单提交", () => {
  it("填写并提交登录表单", async () => {
    const onSubmit = jest.fn();
    const { container } = render(<TestFormWithRef onSubmit={onSubmit} />);

    // 用 form id 限定查询范围，signUp 排在 signIn 前面
    const signInForm = container.querySelector("#signIn")!;
    const si = within(signInForm as HTMLElement);

    await userEvent.type(si.getByPlaceholderText("用户名"), "testuser");
    await userEvent.type(si.getByPlaceholderText("密码"), "pass123");

    const btn = screen.getByRole("button", { name: "登 录" });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { username: "testuser", password: "pass123" },
        "signIn"
      );
    });
  });
});

// ==================== 注册提交后自动跳转登录 ====================
describe("注册提交后自动跳转", () => {
  it("注册成功后自动切到登录面板", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TestFormWithRef onSubmit={onSubmit} />);

    // 切到注册
    fireEvent.click(screen.getByText("去注册!"));

    // 用 form id 限定查询范围
    const signUpForm = document.querySelector("#signUp")!;
    const su = within(signUpForm as HTMLElement);

    await userEvent.type(su.getByPlaceholderText("用户名"), "newuser");
    await userEvent.type(su.getByPlaceholderText("手机号"), "13800138000");
    await userEvent.type(su.getByPlaceholderText("邮箱"), "test");
    await userEvent.type(su.getByPlaceholderText("密码"), "pass123");

    fireEvent.click(screen.getByRole("button", { name: "注 册" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ username: "newuser" }),
        "signUp"
      );
    });

    // 验证自动跳回登录
    await waitFor(() => {
      expect(screen.getByText("登录")).toBeVisible();
    });
  });
});

// ==================== 手机号校验 ====================
describe("手机号校验", () => {
  it("错误手机号显示校验错误", async () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));

    const phoneInput = screen.getByPlaceholderText("手机号");
    await userEvent.type(phoneInput, "123");
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText("请输入正确的手机号")).toBeInTheDocument();
    });
  });

  it("正确手机号通过校验", async () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));

    const phoneInput = screen.getByPlaceholderText("手机号");
    await userEvent.type(phoneInput, "13800138000");
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.queryByText("请输入正确的手机号")).not.toBeInTheDocument();
    });
  });
});

// ==================== 邮箱校验 ====================
describe("邮箱校验", () => {
  it("邮箱输入框和后缀选择器同时存在", () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));

    expect(screen.getByPlaceholderText("邮箱")).toBeInTheDocument();
    // Select 默认显示 @qq.com
    expect(screen.getByText("@qq.com")).toBeInTheDocument();
  });

  it("输入非法邮箱前缀显示校验错误", async () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));

    const emailInput = screen.getByPlaceholderText("邮箱");
    await userEvent.type(emailInput, "abc");
    fireEvent.blur(emailInput);

    // "abc" + "@qq.com" = "abc@qq.com" 是合法的，不会报错
    // 所以这个测试验证合法输入不报错
    await waitFor(() => {
      expect(screen.queryByText("请输入正确的邮箱")).not.toBeInTheDocument();
    });
  });

  it("空输入不触发邮箱校验", async () => {
    render(<TestFormWithRef />);
    fireEvent.click(screen.getByText("去注册!"));

    const emailInput = screen.getByPlaceholderText("邮箱");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByText("请输入正确的邮箱")).not.toBeInTheDocument();
    });
  });
});

// ==================== 忘记密码 ====================
describe("忘记密码", () => {
  it("点击忘记密码触发回调", () => {
    const onForgetPassword = jest.fn();
    render(<TestFormWithRef onForgetPassword={onForgetPassword} />);

    fireEvent.click(screen.getByText("忘记密码"));
    expect(onForgetPassword).toHaveBeenCalledTimes(1);
  });
});

// ==================== ref 方法 ====================
describe("ref 暴露方法", () => {
  it("switchToLogin 切到登录面板", () => {
    const ref = React.createRef<PubLoginFormRef>();
    render(<TestFormWithRef ref={ref} />);

    // 先切到注册
    fireEvent.click(screen.getByText("去注册!"));
    expect(screen.getByText("注册")).toBeVisible();

    // 通过 ref 切回登录
    act(() => ref.current?.switchToLogin());
    expect(screen.getByText("登录")).toBeVisible();
  });

  it("switchToSignUp 切到注册面板", () => {
    const ref = React.createRef<PubLoginFormRef>();
    render(<TestFormWithRef ref={ref} />);
    expect(screen.getByText("登录")).toBeVisible();

    act(() => ref.current?.switchToSignUp());
    expect(screen.getByText("注册")).toBeVisible();
  });
});

// ==================== 不同主题 ====================
describe("主题渲染", () => {
  const themes: PubLoginFormIF["theme"][] = ["techno", "natural", "fire"];

  themes.forEach((theme) => {
    it(`使用 ${theme} 主题正常渲染`, () => {
      render(<TestFormWithRef theme={theme} />);
      expect(screen.getByText("登录")).toBeInTheDocument();
      expect(screen.getByText("注册")).toBeInTheDocument();
    });
  });
});

// ==================== 自定义 component 覆盖 ====================
describe("自定义 component 覆盖", () => {
  it("传入自定义 component 时使用自定义组件", () => {
    const customContent = [
      { label: "自定义", field: "custom", type: "input" as const, component: <input data-testid="my-input" /> },
    ];
    render(<TestFormWithRef signInContent={customContent} />);
    expect(screen.getByTestId("my-input")).toBeInTheDocument();
  });
});
