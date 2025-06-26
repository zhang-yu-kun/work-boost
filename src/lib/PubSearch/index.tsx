import PubForm from "../PubForm";
import { Button } from "antd";
import type { PublicSearchIF } from "../../common/types";
import Provider from "../../common/Provider";
import { useState, useEffect } from "react";

export default function PubSearch({
  form,
  options,
  onFinish,
  collapse,
}: PublicSearchIF) {
  const [collapsed, setCollapsed] = useState(false);
  const [list, setList] = useState(options);
  useEffect(() => {
    if (collapsed) {
      setList(options.slice(0, 7));
    } else {
      setList(options);
    }
  }, [collapsed, options]);
  return (
    <Provider>
      <PubForm
        form={form}
        name="search"
        options={list}
        onFinish={onFinish}
        column={4}
        formlayout={{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}
      >
        <div
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
            <Button type="link" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "展开" : "收起"}
            </Button>
          )}
        </div>
      </PubForm>
    </Provider>
  );
}
