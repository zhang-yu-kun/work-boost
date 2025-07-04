// PubTable.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PubTable from "../lib/PubTable";
import type { PageIF, RowIF, HeaderIF } from "../common/types";
import "@testing-library/jest-dom";

// 修复 JSDOM 环境缺失的方法
beforeAll(() => {
  // 模拟 matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // 兼容旧版
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // 模拟 getComputedStyle
  Object.defineProperty(window, "getComputedStyle", {
    value: () => ({
      getPropertyValue: () => "",
    }),
  });
});

// 模拟 antd Table 组件
jest.mock("antd", () => {
  const original = jest.requireActual("antd");

  // 创建一个带 key 的模拟数据源
  const createDataSource = (data: any[]) =>
    data.map((item) => ({ ...item, key: item.id }));

  return {
    ...original,
    Table: jest.fn(
      ({
        dataSource,
        columns,
        rowSelection,
        pagination,
        onChange,
        loading,
      }) => {
        // 为数据添加 key 属性解决 React 警告
        const dataWithKeys = createDataSource(dataSource || []);

        // 模拟行选择
        const handleRowSelect = (
          selectedRowKeys: React.Key[],
          selectedRows: any
        ) => {
          if (rowSelection?.onChange) {
            rowSelection.onChange(selectedRowKeys, selectedRows);
          }
        };

        // 模拟表格变化
        const handleTableChange = (
          pagination: any,
          filters: any,
          sorter: any,
          extra: any
        ) => {
          if (onChange) {
            onChange(pagination, filters, sorter, extra);
          }
        };

        return (
          <div data-testid="mock-table">
            <div data-testid="table-data-source">
              {JSON.stringify(dataWithKeys)}
            </div>
            <div data-testid="table-columns">{JSON.stringify(columns)}</div>
            <div data-testid="table-pagination">
              {JSON.stringify(pagination)}
            </div>
            <div data-testid="table-loading">{String(loading)}</div>

            {/* 行选择模拟 */}
            <button
              data-testid="select-row-1"
              onClick={() => handleRowSelect([1], [{ id: 1, name: "Item 1" }])}
            >
              Select Row 1
            </button>

            <button
              data-testid="select-row-2"
              onClick={() => handleRowSelect([2], [{ id: 2, name: "Item 2" }])}
            >
              Select Row 2
            </button>

            {/* 分页变化模拟 */}
            <button
              data-testid="change-page"
              onClick={() =>
                handleTableChange({ current: 2, pageSize: 20 }, {}, {}, {})
              }
            >
              Change Page
            </button>
          </div>
        );
      }
    ),
  };
});

describe("PubTable Component", () => {
  // 创建带唯一 key 的模拟数据
  const mockData = [
    { id: 1, name: "Item 1", age: 25, key: 1 },
    { id: 2, name: "Item 2", age: 30, key: 2 },
    { id: 3, name: "Item 3", age: 35, key: 3 },
  ];

  const mockColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
  ];

  const mockPageOption: PageIF = {
    isAuto: true,
    current: 1,
    pageSize: 10,
    total: 50,
  };

  const mockRowOption: RowIF = {
    isSelect: false,
    rowSelects: [1],
    setRowSelects: jest.fn(),
    setRowSelectsInfo: jest.fn(),
  };

  const mockHeader: HeaderIF = {
    isShow: true,
    tableTitle: "Test Table",
    HeaderRender: <div data-testid="header-render">Custom Header</div>,
  };

  const mockTableChange = jest.fn();
  const mockLoading = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基础渲染测试
  it("renders without crashing with minimal props", () => {
    render(
      <PubTable data={mockData} columns={mockColumns} pageOption={false} />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-data-source")).toHaveTextContent(
      JSON.stringify(mockData)
    );
    expect(screen.getByTestId("table-columns")).toHaveTextContent(
      JSON.stringify(mockColumns)
    );
  });

  // 测试header显示
  it("renders header when isShow is true", () => {
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={false}
        header={mockHeader}
      />
    );

    expect(screen.getByTestId("pub-title")).toHaveTextContent("Test Table");
    expect(screen.getByTestId("header-render")).toBeInTheDocument();
  });

  // 测试header隐藏
  it("does not render header when isShow is false", () => {
    const headerWithoutShow = { ...mockHeader, isShow: false };
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={false}
        header={headerWithoutShow}
      />
    );

    expect(screen.queryByTestId("pub-title")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-render")).not.toBeInTheDocument();
  });

  // 测试行选择功能
  it("handles row selection correctly", () => {
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={false}
        rowOption={mockRowOption}
      />
    );

    // 初始选择
    expect(mockRowOption.setRowSelects).not.toHaveBeenCalled();

    // 选择第二行
    fireEvent.click(screen.getByTestId("select-row-2"));

    // 验证选择回调
    expect(mockRowOption.setRowSelects).toHaveBeenCalledWith([2]);
    expect(mockRowOption.setRowSelectsInfo).toHaveBeenCalledWith([
      { id: 2, name: "Item 2" },
    ]);
  });

  // 测试分页配置 - 自动分页模式
  it("configures pagination correctly in auto mode", () => {
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={mockPageOption}
      />
    );

    const pagination = JSON.parse(
      screen.getByTestId("table-pagination").textContent || "{}"
    );
    expect(pagination).toEqual({
      current: undefined, // 自动模式下不传递当前页
      pageSize: undefined, // 自动模式下不传递页面大小
      total: undefined, // 自动模式下不传递总数
      size: "small",
      pageSizeOptions: ["10", "20", "30"],
      showSizeChanger: true,
    });
  });

  // 测试分页配置 - 手动分页模式
  it("configures pagination correctly in manual mode", () => {
    const manualPageOption = { ...mockPageOption, isAuto: false };
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={manualPageOption}
      />
    );

    const pagination = JSON.parse(
      screen.getByTestId("table-pagination").textContent || "{}"
    );
    expect(pagination).toEqual({
      current: 1,
      pageSize: 10,
      total: 50,
      size: "small",
      pageSizeOptions: ["10", "20", "30"],
      showSizeChanger: true,
    });
  });

  // 测试分页禁用
  it("disables pagination when pageOption is false", () => {
    render(
      <PubTable data={mockData} columns={mockColumns} pageOption={false} />
    );

    const pagination = screen.getByTestId("table-pagination").textContent;
    expect(pagination).toBe("false");
  });

  // 测试表格变化事件 - 自动模式
  it("triggers tableChange in auto mode", () => {
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={mockPageOption}
        tableChange={mockTableChange}
      />
    );

    // 触发分页变化
    fireEvent.click(screen.getByTestId("change-page"));

    // 验证变化回调
    expect(mockTableChange).toHaveBeenCalledWith(
      { current: 2, pageSize: 20 },
      {},
      {},
      {}
    );
  });

  // 测试表格变化事件 - 手动模式
  it("does not trigger tableChange in manual mode", () => {
    const manualPageOption = { ...mockPageOption, isAuto: false };
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={manualPageOption}
        tableChange={mockTableChange}
      />
    );

    // 触发分页变化
    fireEvent.click(screen.getByTestId("change-page"));

    // 验证变化回调未被调用
    expect(mockTableChange).not.toHaveBeenCalled();
  });

  // 测试加载状态
  it("displays loading state correctly", () => {
    const { rerender } = render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        loading={true}
        pageOption={false}
      />
    );

    expect(screen.getByTestId("table-loading")).toHaveTextContent("true");

    rerender(
      <PubTable
        data={mockData}
        columns={mockColumns}
        loading={false}
        pageOption={false}
      />
    );

    expect(screen.getByTestId("table-loading")).toHaveTextContent("false");
  });

  // 测试无行选择配置
  it("does not render row selection when rowOption is undefined", () => {
    render(
      <PubTable data={mockData} columns={mockColumns} pageOption={false} />
    );

    // 尝试选择行应该不会触发回调
    fireEvent.click(screen.getByTestId("select-row-1"));
    expect(mockRowOption.setRowSelects).not.toHaveBeenCalled();
  });

  // 测试无表格变化回调
  it("does not trigger tableChange when callback is not provided", () => {
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        pageOption={mockPageOption}
      />
    );

    // 触发分页变化
    fireEvent.click(screen.getByTestId("change-page"));

    // 验证变化回调未被调用
    expect(mockTableChange).not.toHaveBeenCalled();
  });

  // 测试空数据状态
  it("handles empty data correctly", () => {
    render(<PubTable data={[]} columns={mockColumns} pageOption={false} />);

    expect(screen.getByTestId("table-data-source")).toHaveTextContent("[]");
  });

  // 测试默认标题
  it("uses default table title when not provided", () => {
    const headerWithDefaultTitle = { ...mockHeader, tableTitle: undefined };
    render(
      <PubTable
        data={mockData}
        columns={mockColumns}
        header={headerWithDefaultTitle}
        pageOption={false}
      />
    );

    expect(screen.getByTestId("pub-title")).toHaveTextContent("查询列表");
  });
});
