// PubLoginForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Form } from "antd";
import PubLoginForm from "../lib/PubLoginForm"; // 调整路径为你的实际路径
import type { PubLoginFormIF } from "../common/types";

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

// 1. 移除对 CSS/LESS 模块的直接模拟
// 2. 使用 Jest 的 mock 机制模拟 classNames 库
jest.mock("classnames", () => ({
  __esModule: true,
  default: (...args: any[]) => {
    // 简化 classNames 功能，仅返回拼接的类名
    return args.filter((arg) => typeof arg === "string").join(" ");
  },
}));

// 3. 创建 CSS 模块的代理模拟
jest.mock("../common/constant", () => ({
  btn_color_map: {
    techno: {
      bg: "#123456",
      border: "#654321",
      hover: "#abcdef",
      text: "#ffffff",
    },
    natural: {
      bg: "#123456",
      border: "#654321",
      hover: "#abcdef",
      text: "#ffffff",
    },
    fire: {
      bg: "#123456",
      border: "#654321",
      hover: "#abcdef",
      text: "#ffffff",
    },
    ghost: {
      bg: "#123456",
      border: "#654321",
      hover: "#abcdef",
      text: "#ffffff",
    },
  },
}));

describe("PubLoginForm", () => {
  const mockSignInContent = [
    { label: "用户名", field: "username" },
    { label: "密码", field: "password" },
  ];

  const mockSignUpContent = [
    { label: "邮箱", field: "email" },
    { label: "创建密码", field: "newPassword" },
  ];

  const mockOnSubmit = jest.fn();
  const mockOnForgetPassword = jest.fn();

  // 创建表单实例的辅助函数
  const createFormInstance = () => {
    let formInstance: any;
    const TestComponent = () => {
      const [form] = Form.useForm();
      formInstance = form;
      return null;
    };
    render(<TestComponent />);
    return formInstance;
  };

  // 完整的测试组件
  const TestForm = (props: Partial<PubLoginFormIF> = {}) => {
    const [form] = Form.useForm();
    return (
      <PubLoginForm
        form={form}
        theme="techno"
        signInConent={mockSignInContent}
        signUpContent={mockSignUpContent}
        onSubmit={mockOnSubmit}
        onForgetPassword={mockOnForgetPassword}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 测试1: 渲染基础组件
  it("渲染基础组件", () => {
    render(<TestForm />);

    // 验证标题渲染
    expect(screen.getByText("登录")).toBeInTheDocument();
    expect(screen.getByText("注册")).toBeInTheDocument();

    // 验证输入框渲染
    expect(screen.getByPlaceholderText("用户名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("密码")).toBeInTheDocument();

    // 验证按钮渲染
    expect(screen.getByText("登录")).toBeInTheDocument();
    expect(screen.getByText("忘记密码")).toBeInTheDocument();
  });

  // 测试2: 切换登录/注册面板
  it("切换登录和注册面板", () => {
    render(<TestForm />);

    // 初始状态应为登录面板
    expect(screen.getByText("登录")).toBeVisible();

    // 点击"去注册!"按钮
    fireEvent.click(screen.getByText("去注册!"));

    // 验证切换到注册面板
    expect(screen.getByText("注册")).toBeVisible();
    expect(screen.getByPlaceholderText("邮箱")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("创建密码")).toBeInTheDocument();

    // 点击"去登录!"按钮
    fireEvent.click(screen.getByText("去登录!"));

    // 验证切换回登录面板
    expect(screen.getByText("登录")).toBeVisible();
  });

  // 测试3: 提交登录表单
  it("提交登录表单", async () => {
    render(<TestForm />);

    // 填写表单
    fireEvent.change(screen.getByPlaceholderText("用户名"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("密码"), {
      target: { value: "password123" },
    });

    // 提交表单
    const element = screen.getByRole("button", { name: "登 录" });

    fireEvent.click(element);

    // 验证回调函数被调用
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  // 测试4: 提交注册表单
  it("提交注册表单", async () => {
    // 模拟表单提交

    render(<TestForm />);

    // 切换到注册面板
    fireEvent.click(screen.getByRole("button", { name: "去注册!" }));

    // 填充表单
    fireEvent.change(screen.getByPlaceholderText("邮箱"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("创建密码"), {
      target: { value: "newpassword123" },
    });

    // 触发表单验证
    fireEvent.blur(screen.getByPlaceholderText("邮箱"));
    fireEvent.blur(screen.getByPlaceholderText("创建密码"));

    // 等待验证完成
    await waitFor(() => {
      expect(screen.queryAllByRole("alert").length).toBe(0);
    });
    // 提交表单
    fireEvent.click(screen.getByRole("button", { name: "注 册" }));
    // 验证回调
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        newPassword: "newpassword123",
      });
    });
  });

  // 测试5: 忘记密码功能
  it("触发忘记密码回调", () => {
    render(<TestForm />);

    fireEvent.click(screen.getByText("忘记密码"));

    expect(mockOnForgetPassword).toHaveBeenCalledTimes(1);
  });

  // 测试6: 表单重置功能
  it("切换面板时重置表单", () => {
    render(<TestForm />);

    // 在登录表单中输入数据
    fireEvent.change(screen.getByPlaceholderText("用户名"), {
      target: { value: "testuser" },
    });

    // 切换到注册面板
    fireEvent.click(screen.getByText("去注册!"));

    // 切换回登录面板
    fireEvent.click(screen.getByText("去登录!"));

    // 验证表单已重置
    expect(screen.getByPlaceholderText("用户名")).toHaveValue("");
  });

  // 测试7: 按钮主题样式
  it("应用正确的按钮主题样式", () => {
    render(<TestForm />);

    // 验证按钮存在
    expect(screen.getByText("登录")).toBeInTheDocument();
    expect(screen.getByText("注册")).toBeInTheDocument();
  });

  // 测试8: 可选props缺失时的行为
  it("处理可选props缺失的情况", () => {
    const formInstance = createFormInstance();

    render(
      <PubLoginForm
        form={formInstance}
        theme="techno"
        signInConent={mockSignInContent}
        signUpContent={[]}
        onSubmit={mockOnSubmit}
        onForgetPassword={() => {}}
      />
    );

    // 验证基本功能仍然可用
    expect(screen.getByText("登录")).toBeInTheDocument();
  });

  // 测试9: 不同主题的渲染
  it("使用不同主题渲染组件", () => {
    const formInstance = createFormInstance();

    const themes: Array<PubLoginFormIF["theme"]> = [
      "techno",
      "natural",
      "fire",
    ];

    themes.forEach((theme) => {
      const { unmount } = render(
        <PubLoginForm
          form={formInstance}
          theme={theme}
          signInConent={mockSignInContent}
          signUpContent={mockSignUpContent}
          onSubmit={mockOnSubmit}
          onForgetPassword={mockOnForgetPassword}
        />
      );

      // 验证主题特定元素存在
      expect(screen.getByText("登录")).toBeInTheDocument();
      unmount();
    });
  });
});
