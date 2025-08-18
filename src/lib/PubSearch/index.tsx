import PubForm from "../PubForm";
import { Button } from "antd";
import type { PublicSearchIF } from "../../common/types";
import Provider from "../../common/Provider";
import { useState, useEffect } from "react";

const PubSearch: React.FC<PublicSearchIF> = ({
  form,
  options,
  onFinish,
  collapse = false,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [list, setList] = useState(options);
  useEffect(() => {
    if (collapse && collapsed) {
      setList(options.slice(0, 7));
    } else {
      setList(options);
    }
  }, [collapse, collapsed, options]);
  return (
    <div style={{ padding: "12px 22px", background: "#fff", borderRadius: 8 }}>
      <PubForm
        form={form}
        name="search"
        options={list}
        onFinish={onFinish}
        column={4}
        formlayout={{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}
      >
        <div
          data-testid="buttons"
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
            重置
          </Button>
          {collapse && options.length > 7 && (
            <Button
              type="link"
              onClick={() => setCollapsed(!collapsed)}
              data-testid="collapsed"
            >
              {collapsed ? "展开" : "收起"}
            </Button>
          )}
        </div>
      </PubForm>
    </div>
  );
};
export default PubSearch;
