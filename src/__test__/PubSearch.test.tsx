import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PubSearch from "../lib/PubSearch"; // 根据实际路径调整
import Provider from "../common/Provider"; // 引入真实组件
import { Form, Input } from "antd";

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

describe("PubSearch Component (Integration Test)", () => {
  const mockOptions = (number: number) =>
    Array.from({ length: number }, (_, i) => ({
      field: `field${i}`,
      label: `Field ${i}`,
      component: <Input placeholder={`Input ${i}`} />,
    }));

  const mockOnFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 创建包裹组件以提供 Form 上下文
  const renderPubSearch = (props: any) => {
    const Wrapper = () => {
      const [form] = Form.useForm();
      return (
        <Provider>
          <PubSearch form={form} onFinish={mockOnFinish} {...props} />
        </Provider>
      );
    };
    return render(<Wrapper />);
  };

  // 测试 1: 基础渲染
  it("renders without crashing and shows all form fields", () => {
    renderPubSearch({ options: mockOptions(3) });

    expect(screen.getByText("查 询")).toBeInTheDocument();
    expect(screen.getByText("重 置")).toBeInTheDocument();
    expect(screen.queryByText("展开")).not.toBeInTheDocument();

    // 验证所有字段都被渲染
    expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Input 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Input 2")).toBeInTheDocument();
  });

  // 测试 2: 表单提交功能
  it("handles form submission", async () => {
    renderPubSearch({ options: mockOptions(2) });

    // 输入一些值
    fireEvent.change(screen.getByPlaceholderText("Input 0"), {
      target: { value: "test value" },
    });

    // 提交表单
    fireEvent.click(screen.getByText("查 询"));

    // 等待异步操作完成
    await waitFor(() => {
      expect(mockOnFinish).toHaveBeenCalledTimes(1);
      expect(mockOnFinish).toHaveBeenCalledWith(
        expect.objectContaining({
          field0: "test value",
        })
      );
    });
  });

  // 测试 3: 表单重置功能
  it("handles form reset", async () => {
    renderPubSearch({ options: mockOptions(2) });

    // 输入一些值
    const input = screen.getByPlaceholderText("Input 0") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test value" } });

    // 验证输入值
    expect(input.value).toBe("test value");

    // 重置表单
    const resetButton = screen.getByText((content) =>
      content.includes("重 置")
    );
    fireEvent.click(resetButton);

    // 验证输入值被清除;
    await waitFor(() => {
      const updatedInput = screen.getByPlaceholderText(
        "Input 0"
      ) as HTMLInputElement;
      expect(updatedInput.value).toBe("");
    });
  });

  // 测试 4: 展开/收起功能  成功
  it("toggles collapse when collapse enabled and options > 7", async () => {
    renderPubSearch({
      options: mockOptions(10),
      collapse: true,
    });

    // 初始状态应为收起（只显示前7个字段）
    expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Input 6")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Input 7")).not.toBeInTheDocument();
    expect(screen.getByText("展开")).toBeInTheDocument();

    // 点击展开
    fireEvent.click(screen.getByText("展开"));

    // 验证所有字段都显示
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Input 7")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 9")).toBeInTheDocument();
      expect(screen.getByText("收起")).toBeInTheDocument();
    });

    // 点击收起
    fireEvent.click(screen.getByText("收起"));

    // 验证只显示前7个字段
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 6")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Input 7")).not.toBeInTheDocument();
    });
  });

  // 测试 5: 不同配置下的行为 成功
  describe("conditional rendering", () => {
    it("does not show collapse button when options <= 7", () => {
      renderPubSearch({
        options: mockOptions(5),
        collapse: true,
      });

      expect(screen.queryByText("展开")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 4")).toBeInTheDocument();
    });

    it("does not show collapse button when collapse=false", () => {
      renderPubSearch({
        options: mockOptions(10),
        collapse: false,
      });

      expect(screen.queryByText("展开")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 9")).toBeInTheDocument();
    });
  });

  // 测试 6: 按钮位置和样式 成功
  it("has buttons aligned to the right", () => {
    renderPubSearch({ options: mockOptions(2) });
    const buttonsContainer = screen.getByTestId("buttons");
    expect(buttonsContainer).toHaveStyle({
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
    });
  });

  // 测试 7: 重置按钮间距 成功
  it("has correct spacing for reset button", () => {
    renderPubSearch({ options: mockOptions(2) });
    const resetButton = screen.getByText("重 置").parentElement;
    expect(resetButton).toHaveStyle({
      marginLeft: "8px",
    });
  });

  // 测试 8: 选项变化时更新列表 成功
  it("updates form fields when options prop changes", async () => {
    const { rerender } = renderPubSearch({
      options: mockOptions(2),
    });

    const TestComponent = () => {
      return (
        <Provider>
          <PubSearch
            form={Form.useForm()[0]}
            options={mockOptions(4)}
            onFinish={mockOnFinish}
          />
        </Provider>
      );
    };

    expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Input 1")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Input 2")).not.toBeInTheDocument();

    // 重新渲染组件，增加选项数量
    rerender(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 3")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Input 4")).not.toBeInTheDocument();
    });
  });

  // 测试 9: 当选项减少时收起状态更新 成功
  it("updates collapse state when options are reduced", async () => {
    const { rerender } = renderPubSearch({
      options: mockOptions(10),
      collapse: true,
    });

    expect(screen.getByText("展开")).toBeInTheDocument();

    // 减少选项数量到5个
    const TestComponent = () => {
      return (
        <Provider>
          <PubSearch
            form={Form.useForm()[0]}
            options={mockOptions(5)}
            onFinish={mockOnFinish}
          />
        </Provider>
      );
    };
    rerender(<TestComponent />);

    await waitFor(() => {
      // 应该显示所有5个字段
      expect(screen.getByPlaceholderText("Input 0")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input 4")).toBeInTheDocument();
      // 收起按钮应该消失
      expect(screen.queryByText("展开")).not.toBeInTheDocument();
    });
  });

  // 测试 10: 表单验证 成功
  it("validates form fields", async () => {
    const optionsWithValidation = [
      {
        field: "requiredField",
        label: "Required Field",
        component: <Input />,
        rules: [{ required: true, message: "This field is required" }],
      },
    ];

    renderPubSearch({ options: optionsWithValidation });

    // 尝试提交空表单
    fireEvent.click(screen.getByText("查 询"));

    // 验证错误消息
    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
    const element = document.querySelector(
      "#search_requiredField"
    ) as HTMLInputElement;
    // 填写必填字段
    fireEvent.change(element, {
      target: { value: "test" },
    });

    // 再次提交
    fireEvent.click(screen.getByText("查 询"));

    // 验证成功提交
    await waitFor(() => {
      expect(mockOnFinish).toHaveBeenCalledWith(
        expect.objectContaining({ requiredField: "test" })
      );
    });
  });
});
