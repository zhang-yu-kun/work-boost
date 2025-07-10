import { Form, Row, Col } from "antd";
import { form_column_map, form_offset_config_map } from "../../common/constant";
import type { PublicFormIF, OptionItemIF } from "../../common/types";
import Provider from "../../common/Provider";

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
    <Provider>
      <Form
        name={name}
        form={form}
        onFinish={onFinish}
        {...formlayout}
        style={{ width: "100%" }}
        clearOnDestroy
      >
        <Row gutter={16}>
          {options?.map((item: OptionItemIF, index) => {
            if (item.isFlex) {
              return (
                <Col
                  style={{ marginTop: 12, marginBottom: 12 }}
                  span={form_column_map[column]}
                  key={index}
                >
                  {item.component}
                </Col>
              );
            }
            return (
              <Col
                style={{ marginTop: 12, marginBottom: 12 }}
                span={form_column_map[column]}
                key={item.field}
              >
                <Form.Item
                  label={item.label}
                  name={item.field}
                  rules={item.rules}
                  labelCol={item.labelCol}
                  wrapperCol={item.wrapperCol}
                >
                  {item.component}
                </Form.Item>
              </Col>
            );
          })}
          {children && (
            <Col
              style={{ marginTop: 12, marginBottom: 12 }}
              span={form_column_map[column]}
              offset={offset()}
            >
              {children}
            </Col>
          )}
        </Row>
      </Form>
    </Provider>
  );
}
