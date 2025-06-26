import { Form, Row, Col } from "antd";
import { form_column_map, form_offset_config_map } from "../../common/constant";
import type { PublicFormIF, OptionItemIF } from "../../common/types";

export default function PubForm({
  form,
  name,
  options,
  onFinish,
  column = 2,
  formlayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
  children,
}: PublicFormIF) {
  const offset = (): number => {
    const { map, length } = form_offset_config_map[column];
    const index = options.length % length;
    return map[index];
  };

  return (
    <Form
      name={name}
      form={form}
      onFinish={onFinish}
      {...formlayout}
      style={{ width: "100%" }}
      clearOnDestroy
    >
      <Row gutter={16}>
        {options?.map((item: OptionItemIF, index) => (
          <Col
            span={form_column_map[column]}
            key={!item.isFlex ? item.field : index}
          >
            {!item.isFlex ? (
              <Form.Item
                label={item.label}
                name={item.field}
                rules={item.rules}
                labelCol={item.labelCol}
                wrapperCol={item.wrapperCol}
              >
                {item.component}
              </Form.Item>
            ) : (
              item.component
            )}
          </Col>
        ))}
        {children && (
          <Col span={form_column_map[column]} offset={offset()}>
            {children}
          </Col>
        )}
      </Row>
    </Form>
  );
}
