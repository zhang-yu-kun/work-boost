import { Button, Form, Input } from "antd";
import PubSearch from "../lib/PubSearch";
import PubTable from "../lib/PubTable";
import PubForm from "../lib/PubForm";
import PubStepForm from "../lib/PubStepForm";

export const ItemA = () => {
  const [form] = Form.useForm();
  const options = [
    {
      isFlex: true,
      component: (
        <Form.Item label="ccc">
          <Form.Item name="aaa">
            <Input />
          </Form.Item>
          <Form.Item name="bbb">
            <Input />
          </Form.Item>
        </Form.Item>
      ),
    },
  ];
  return (
    <PubForm
      form={form}
      name="test"
      options={options}
      onFinish={(v) => console.log(v)}
    >
      <Button htmlType="submit">提交</Button>
    </PubForm>
  );
};

export const ItemB = () => {
  const [form] = Form.useForm();
  return (
    <div>
      <PubSearch
        form={form}
        options={[{ label: "测试", field: "aaa", component: <Input /> }]}
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
        header={{
          HeaderRender: [{ text: "测试", type: "primary" }, { text: "daochu" }],
        }}
      />
    </div>
  );
};

export const ItemC = () => {
  const [form] = Form.useForm();

  const steps = [
    {
      title: "第一步",
      options: [
        { label: "测试", field: "aaa", component: <Input /> },
        { label: "测试2", field: "bbb", component: <Input /> },
      ],
    },
    {
      title: "第二步",
      options: [
        { label: "测试3", field: "ccc", component: <Input /> },
        { label: "测试4", field: "ddd", component: <Input /> },
      ],
    },
  ];
  return (
    <div>
      <PubStepForm
        form={form}
        steps={steps}
        onNext={() => {}}
        onPrev={() => {}}
      />
    </div>
  );
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
