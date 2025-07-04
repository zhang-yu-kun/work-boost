import Provider from "../../common/Provider";
import { form_column_map } from "../../common/constant";
import type { PublicStepFormIF, OptionItemIF } from "../../common/types";
import { useState, useMemo } from "react";
import { Steps, Button, Form, Row, Col } from "antd";

export default function PubStepForm(props: PublicStepFormIF) {
  const { form, steps, onPrev, onNext, formlayout, column = 1 } = props;
  const [current, setCurrent] = useState(0);
  const stepItem = steps.map(
    (item: { title: string; options: OptionItemIF[] }) => ({
      title: item.title,
    })
  );
  const options = useMemo(() => {
    return steps[current]?.options;
  }, [current, steps]);
  const hanldePrev = () => {
    setCurrent((prev) => prev - 1);
    onPrev();
  };
  const handelNext = (value: any) => {
    setCurrent((prev) => prev + 1);
    onNext(value);
  };
  return (
    <Provider>
      <Form
        name="stepsForm"
        form={form}
        onFinish={handelNext}
        {...formlayout}
        style={{ width: "100%" }}
        clearOnDestroy
      >
        <Steps
          current={current}
          items={stepItem}
          style={{ marginBottom: 20 }}
        />
        <Row gutter={16}>
          {options?.map((item: OptionItemIF, index) => (
            <Col
              role="col"
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
        </Row>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {current > 0 && (
            <Button onClick={hanldePrev} style={{ marginRight: 8 }}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button htmlType="submit" type="primary">
              下一步
            </Button>
          )}
        </div>
      </Form>
    </Provider>
  );
}
