import { Button, Table } from "antd";
import Provider from "../../common/Provider";
import type { TablePaginationConfig } from "antd";
import type {
  PublicTableIF,
  PageIF,
  RowIF,
  HeaderIF,
} from "../../common/types";
import PubTitle from "../PubTitle";

const PubTable: React.FC<PublicTableIF> = ({
  data,
  columns,
  pageOption,
  rowOption,
  tableChange,
  header,
  loading = false,
}) => {
  const {
    isShow = true,
    tableTitle = "查询列表",
    HeaderRender,
  } = header || ({} as HeaderIF);
  const { isAuto = true, current, pageSize, total } = pageOption as PageIF;
  const { rowSelects, setRowSelects, setRowSelectsInfo } =
    rowOption || ({} as RowIF);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    setRowSelects?.(selectedRowKeys);
    setRowSelectsInfo?.(selectedRows);
  };

  const setPagination = (): false | TablePaginationConfig => {
    if (pageOption === false) {
      return false;
    }
    return {
      current: !isAuto ? current : undefined,
      pageSize: !isAuto ? pageSize : undefined,
      total: !isAuto ? total : undefined,
      size: "small",
      pageSizeOptions: ["10", "20", "30"],
      showSizeChanger: true,
    };
  };

  const onChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    if (
      pageOption !== false &&
      isAuto !== false &&
      typeof tableChange === "function"
    ) {
      tableChange(pagination, filters, sorter, extra);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        marginTop: 24,
        padding: "12px 22px 32px",
      }}
    >
      {isShow && (
        <div
          style={{
            height: 52,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PubTitle text={tableTitle} />
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {HeaderRender?.map((item, index: number) => (
              <Button
                key={index}
                type={item.type || "default"}
                htmlType={item.htmlType || "button"}
                style={{ marginLeft: 8 }}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Table
        dataSource={data}
        columns={columns}
        rowSelection={
          rowOption !== undefined
            ? {
                selectedRowKeys: rowSelects,
                onChange: onSelectChange,
                preserveSelectedRowKeys: true,
              }
            : undefined
        }
        pagination={setPagination()}
        onChange={onChange}
        loading={loading}
      />
    </div>
  );
};

export default PubTable;
