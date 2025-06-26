import { Table } from "antd";
import Provider from "../../common/Provider";
import type { TablePaginationConfig } from "antd";
import type {
  PublicTableIF,
  PageIF,
  RowIF,
  HeaderIF,
} from "../../common/types";
import PubTitle from "../PubTitle";

const PubTable = ({
  data,
  columns,
  pageOption,
  rowOption,
  tableChange,
  header,
  loading = false,
}: PublicTableIF) => {
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
    <Provider>
      <div>
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

            {HeaderRender}
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
    </Provider>
  );
};

export default PubTable;
