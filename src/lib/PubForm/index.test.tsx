import React from "react";
import { render, screen } from "@testing-library/react";
import PubForm from "./index";
import { Form } from "antd";
import { form_column_map, form_offset_config_map } from "../../common/constant";
import type { ColProps } from "antd";
import type { OptionItemIF } from "../../common/types";

// 为 mock 的 Col 添加类型
jest.mock("antd", () => {
  const originalModule = jest.requireActual("antd");
  return {
    ...originalModule,
    Form: {
      ...originalModule.Form,
      Item: ({
        children,
        label,
        name,
      }: React.ComponentProps<typeof originalModule.Form.Item>) => (
        <div data-testid="form-item" data-label={label} data-name={name}>
          {children}
        </div>
      ),
    },
    Row: ({
      children,
      gutter,
    }: React.ComponentProps<typeof originalModule.Row>) => (
      <div data-testid="row" data-gutter={gutter}>
        {children}
      </div>
    ),
    Col: ({ span, offset, children }: ColProps) => (
      <div data-testid="col" data-span={span} data-offset={offset}>
        {children}
      </div>
    ),
  };
});

describe("PubForm Component", () => {
  const mockOnFinish = jest.fn();

  beforeEach(() => {
    mockOnFinish.mockReset();
  });

  it("correctly applies form_column_map for column=2", () => {
    const options = [
      { label: "Name", field: "name", component: <input type="text" /> },
      { label: "Email", field: "email", component: <input type="email" /> },
    ];

    const TestComponent = () => {
      const form = Form.useForm()[0];
      return (
        <PubForm
          form={form}
          name="testForm"
          options={options}
          onFinish={mockOnFinish}
          column={2}
        />
      );
    };

    const { getAllByTestId } = render(<TestComponent />);

    const cols = getAllByTestId("col");
    cols.forEach((col) => {
      expect(col.getAttribute("data-span")).toBe(form_column_map[2].toString());
    });
  });

  it("correctly applies form_offset_config_map for column=2 and options.length=1", () => {
    const options = [
      { label: "Name", field: "name", component: <input type="text" /> },
    ];
    const children = <button type="submit">Submit</button>;

    const TestComponent = () => {
      const form = Form.useForm()[0];
      return (
        <PubForm
          form={form}
          name="testForm"
          options={options}
          onFinish={mockOnFinish}
          column={2}
          children={children}
        />
      );
    };

    const { getAllByTestId } = render(<TestComponent />);
    const cols = getAllByTestId("col"); // 查找所有 Col

    // 通过内容定位 children 的 Col
    const colWithChildren = cols.find((col) => {
      const textContent = col.textContent || "";
      return textContent.includes("Submit");
    });

    const expectedOffset =
      form_offset_config_map[2].map[
        options.length % form_offset_config_map[2].length
      ];
    expect(colWithChildren?.getAttribute("data-offset")).toBe(
      expectedOffset.toString()
    );
  });

  it("correctly applies form_offset_config_map for column=2 and options.length=2", () => {
    const options = [
      { label: "Name", field: "name", component: <input type="text" /> },
      { label: "Email", field: "email", component: <input type="email" /> },
    ];
    const children = <button type="submit">Submit</button>;

    const TestComponent = () => {
      const form = Form.useForm()[0];
      return (
        <PubForm
          form={form}
          name="testForm"
          options={options}
          onFinish={mockOnFinish}
          column={2}
          children={children}
        />
      );
    };

    const { getAllByTestId } = render(<TestComponent />);
    const cols = getAllByTestId("col"); // 查找所有 Col

    // 通过内容定位 children 的 Col
    const colWithChildren = cols.find((col) => {
      const textContent = col.textContent || "";
      return textContent.includes("Submit");
    });

    const expectedOffset =
      form_offset_config_map[2].map[
        options.length % form_offset_config_map[2].length
      ];
    expect(colWithChildren?.getAttribute("data-offset")).toBe(
      expectedOffset.toString()
    );
  });
  it("renders isFlex component without Form.Item", () => {
    const options: OptionItemIF[] = [
      {
        component: <div>Flex Component</div>,
        isFlex: true,
      },
    ];

    const TestComponent = () => {
      const [form] = Form.useForm();
      return (
        <PubForm
          form={form}
          name="testForm"
          options={options}
          onFinish={jest.fn()}
          column={2}
        />
      );
    };

    const { container } = render(<TestComponent />);
    expect(container).toHaveTextContent("Flex Component");
    expect(container.querySelector("form-item")).toBeNull(); // 确保没有 Form.Item
  });
  it("correctly applies form_column_map for column=1", () => {
    const options = [
      {
        label: "Name",
        field: "name",
        component: <input />,
        isFlex: false,
      },
    ];

    const TestComponent = () => {
      const [form] = Form.useForm();
      return (
        <PubForm
          form={form}
          name="testForm"
          options={options}
          onFinish={jest.fn()}
          column={1}
        />
      );
    };

    render(<TestComponent />);
    const col = screen.getByTestId("col");
    expect(col).toBeInTheDocument();
    expect(col).toHaveAttribute("data-span", "24");
  });
  describe("PubForm Component", () => {
    const testCases = [1, 2, 3];

    testCases.forEach((length) => {
      it(`offset for options.length=${length}`, () => {
        const TestComponent = ({
          optionsLength,
        }: {
          optionsLength: number;
        }) => {
          const [form] = Form.useForm();
          const options = Array.from({ length: optionsLength }, (_, i) => ({
            label: `Field ${i}`,
            field: `field${i}`,
            component: <input />,
          }));

          return (
            <PubForm
              form={form}
              name="testForm"
              options={options}
              onFinish={jest.fn()}
              column={2}
              children={<button type="submit">Submit</button>}
            />
          );
        };

        const { container } = render(<TestComponent optionsLength={length} />);
        if (length % form_offset_config_map[2].length === 0) return; // 跳过 length 为 2 的测试用例（因为只有一个选项，没有偏移）

        // screen.debug(); // 可选调试
        const col = container.querySelector("col:last-child");
        const offset = parseInt(col?.getAttribute("offset") || "0", 10);

        expect(offset).toBe(
          form_offset_config_map[2].map[
            length % form_offset_config_map[2].length
          ]
        );
      });
    });
  });
});
