import { Form, Input } from "antd";
import PubSearch from "../lib/PubSearch";
import PubTable from "../lib/PubTable";

export const ItemA = () => {
  return <></>;
};

export const ItemB = () => {
  const [form] = Form.useForm();
  return (
    <div>
      <PubSearch
        form={form}
        options={[
          { label: "测试", field: "aaa", component: <Input /> },
          { label: "测试", field: "aa2", component: <Input /> },
          { label: "测试", field: "aa3", component: <Input /> },
          { label: "测试", field: "aa4", component: <Input /> },
        ]}
        onFinish={() => {}}
      />
      <PubTable
        data={[
          {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: ["nice", "developer"],
          },
          {
            key: "2",
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["loser"],
          },
          {
            key: "3",
            name: "Joe Black",
            age: 32,
            address: "Sydney No. 1 Lake Park",
            tags: ["cool", "teacher"],
          },
        ]}
        pageOption={false}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
          },
          {
            title: "Age",
            dataIndex: "age",
            key: "age",
          },
          {
            title: "Address",
            dataIndex: "address",
            key: "address",
          },
        ]}
      />
    </div>
  );
};

export const ItemC = () => {
  return <div>ItemC</div>;
};

export const ItemD = () => {
  return <div>ItemD</div>;
};

export const ItemE = () => {
  return <div>ItemE</div>;
};

export const ItemF = () => {
  return <div>ItemF</div>;
};

export const ItemG = () => {
  return <div>ItemG</div>;
};

export const ItemH = () => {
  return <div>ItemH</div>;
};
