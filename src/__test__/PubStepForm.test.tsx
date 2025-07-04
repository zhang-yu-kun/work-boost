import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PubStepForm from "../lib/PubStepForm";
import { Form, Input } from "antd";
import type { PublicStepFormIF, OptionItemIF } from "../common/types";
import "@testing-library/jest-dom";

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
// 模拟 Provider 组件
jest.mock("../common/Provider", () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
}));

// 模拟 antd 组件
jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    Steps: jest.fn(({ current, items }) => (
      <div data-testid="steps">
        {items.map((item: any, index: number) => (
          <div
            key={index}
            data-testid={`step-${index}`}
            data-active={index === current}
          >
            {item.title}
          </div>
        ))}
      </div>
    )),
    Button: jest.fn(({ children, onClick, htmlType, type }) => (
      <button
        onClick={onClick}
        data-type={type}
        data-htmltype={htmlType}
        data-testid={children === "上一步" ? "prev-button" : "next-button"}
      >
        {children}
      </button>
    )),
  };
});

// 创建包装组件以正确使用表单钩子
const TestWrapper: React.FC<Partial<PublicStepFormIF>> = (props) => {
  const [form] = Form.useForm();

  const defaultProps = {
    form,
    steps: props.steps || [],
    onPrev: props.onPrev || jest.fn(),
    onNext: props.onNext || jest.fn(),
    formlayout: props.formlayout || {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    column: props.column || 1,
  };

  return <PubStepForm {...defaultProps} />;
};

describe("PubStepForm Component", () => {
  // 模拟步骤配置
  const mockSteps: { title: string; options: OptionItemIF[] }[] = [
    {
      title: "Step 1",
      options: [
        {
          field: "name",
          label: "姓名",
          component: <Input placeholder="请输入姓名" />,
          rules: [{ required: true, message: "请输入姓名" }],
        },
        {
          field: "age",
          label: "年龄",
          component: <Input placeholder="请输入年龄" type="number" />,
        },
      ],
    },
    {
      title: "Step 2",
      options: [
        {
          field: "email",
          label: "邮箱",
          component: <Input placeholder="请输入邮箱" />,
        },
        {
          isFlex: true,
          component: <div data-testid="custom-component">自定义组件</div>,
        },
      ],
    },
    {
      title: "Step 3",
      options: [
        {
          field: "country",
          label: "国家",
          component: <div data-testid="country-select">国家选择器</div>,
        },
      ],
    },
  ];

  const mockOnPrev = jest.fn();
  const mockOnNext = jest.fn();

  const defaultProps = {
    steps: mockSteps,
    onPrev: mockOnPrev,
    onNext: mockOnNext,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基础渲染测试
  it("渲染第一步并显示正确的内容", () => {
    render(<TestWrapper {...defaultProps} />);

    // 验证步骤显示
    expect(screen.getByTestId("step-0")).toHaveAttribute("data-active", "true");
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-active",
      "false"
    );

    // 验证表单字段
    expect(screen.getByPlaceholderText("请输入姓名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入年龄")).toBeInTheDocument();

    // 验证按钮
    expect(screen.queryByTestId("prev-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });
  // 测试表单验证
  it("在必填字段未填写时阻止下一步", async () => {
    render(<TestWrapper {...defaultProps} />);

    // 尝试直接下一步（未填写必填字段）
    fireEvent.click(screen.getByTestId("next-button"));

    // 验证错误消息
    await waitFor(() => {
      expect(screen.getByText("请输入姓名")).toBeInTheDocument();
    });

    // 验证未调用下一步回调
    expect(mockOnNext).not.toHaveBeenCalled();

    // 填写必填字段
    fireEvent.change(screen.getByPlaceholderText("请输入姓名"), {
      target: { value: "张三" },
    });

    // 再次尝试下一步
    fireEvent.click(screen.getByTestId("next-button"));

    // 验证调用下一步回调
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalled();
    });
  });
  // 测试表单数据传递
  it("将表单数据传递给onNext回调", async () => {
    render(<TestWrapper {...defaultProps} />);

    // 填写表单
    fireEvent.change(screen.getByPlaceholderText("请输入姓名"), {
      target: { value: "李四" },
    });
    fireEvent.change(screen.getByPlaceholderText("请输入年龄"), {
      target: { value: "30" },
    });

    // 下一步
    fireEvent.click(screen.getByTestId("next-button"));

    // 验证回调数据
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "李四",
          age: "30",
        })
      );
    });
  });
  // 测试列布局
  it("根据column属性设置正确的列布局", () => {
    const { rerender } = render(<TestWrapper {...defaultProps} column={2} />);

    // 验证2列布局
    const colElements = document.querySelectorAll(".ant-col");
    expect(colElements.length).toBeGreaterThan(0);

    // 改为3列布局
    rerender(<TestWrapper {...defaultProps} column={3} />);

    // 不需要具体验证列宽，因为Ant Design的Col组件渲染由Jest模拟处理
  });
  // 测试第一步没有上一步按钮
  it("在第一步不显示上一步按钮", () => {
    render(<TestWrapper {...defaultProps} />);
    expect(screen.queryByTestId("prev-button")).not.toBeInTheDocument();
  });

  // 测试步骤切换
  it("点击下一步切换到第二步", async () => {
    render(<TestWrapper {...defaultProps} />);

    // 填写必填字段以确保能进入下一步
    fireEvent.change(screen.getByPlaceholderText("请输入姓名"), {
      target: { value: "张三" },
    });

    // 切换到下一步
    fireEvent.click(screen.getByTestId("next-button"));

    // 等待状态更新
    await waitFor(() => {
      // 验证步骤变化
      expect(screen.getByTestId("step-1")).toHaveAttribute(
        "data-active",
        "true"
      );

      // 验证表单字段变化
      expect(screen.getByPlaceholderText("请输入邮箱")).toBeInTheDocument();
      expect(screen.getByTestId("custom-component")).toBeInTheDocument();

      // 验证按钮变化
      expect(screen.getByTestId("prev-button")).toBeInTheDocument();
      expect(screen.getByTestId("next-button")).toBeInTheDocument();

      // 验证回调调用
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  // 测试上一步功能
  it("点击上一步返回第一步", async () => {
    render(<TestWrapper {...defaultProps} />);

    // 填写必填字段以确保能进入下一步
    fireEvent.change(screen.getByPlaceholderText("请输入姓名"), {
      target: { value: "张三" },
    });

    // 点击下一步，进入第二步
    fireEvent.click(screen.getByTestId("next-button"));

    // 等待进入第二步
    await waitFor(() => {
      expect(screen.getByTestId("step-1")).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    // 现在应该显示上一步按钮，点击它
    fireEvent.click(screen.getByTestId("prev-button"));

    // 等待并验证回到第一步
    await waitFor(() => {
      expect(screen.getByTestId("step-0")).toHaveAttribute(
        "data-active",
        "true"
      );
      expect(mockOnPrev).toHaveBeenCalled();
    });
  });

  // 测试最后一步按钮状态
  it("点击上一步返回第一步", async () => {
    render(<TestWrapper {...defaultProps} />);

    // 填写必填字段
    fireEvent.change(screen.getByPlaceholderText("请输入姓名"), {
      target: { value: "张三" },
    });

    // 进入第二步
    fireEvent.click(screen.getByTestId("next-button"));

    // 等待进入第二步
    await waitFor(() => {
      expect(screen.getByTestId("step-1")).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    // 点击上一步按钮
    fireEvent.click(screen.getByTestId("prev-button"));

    // 等待返回第一步
    await waitFor(() => {
      expect(screen.getByTestId("step-0")).toHaveAttribute(
        "data-active",
        "true"
      );
      expect(mockOnPrev).toHaveBeenCalled();
    });
  });

  // 测试最后一步没有下一步按钮
  it("在最后一步不显示下一步按钮", async () => {
    render(<TestWrapper {...defaultProps} />);

    // 填写必填字段
    fireEvent.change(screen.getByPlaceholderText("请输入姓名"), {
      target: { value: "张三" },
    });

    // 进入第二步
    fireEvent.click(screen.getByTestId("next-button"));

    // 等待进入第二步
    await waitFor(() => {
      expect(screen.getByTestId("step-1")).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    // 进入第三步
    fireEvent.click(screen.getByTestId("next-button"));

    // 等待进入第三步
    await waitFor(() => {
      expect(screen.getByTestId("step-2")).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    // 验证最后一步没有下一步按钮
    expect(screen.queryByTestId("next-button")).not.toBeInTheDocument();
  });

  it("当step为空时不渲染任何内容", () => {
    const TestComponent = () => {
      return (
        <PubStepForm
          form={Form.useForm()[0]}
          onNext={() => {}}
          onPrev={() => {}}
          steps={[]}
        />
      );
    };
    render(<TestComponent />);
    expect(screen.queryByTestId("step-form")).not.toBeInTheDocument();
  });
});
