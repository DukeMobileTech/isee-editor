import React from "react";
import { Row, Col, Button, Icon, Modal } from "antd";
import { updateOption, createOption } from "../../utils/API";
import { useFormState } from "react-use-form-state";
import * as Yup from "yup";

const OptionSchema = Yup.object().shape({
  identifier: Yup.string().required("Identifier is required"),
  text: Yup.string().required("Text is required")
});

const OptionForm = props => {
  const option = props.option
    ? props.option
    : { identifier: "", text: "", id: "" };
  const title = option.identifier.length > 0 ? option.identifier : "New Option";
  const [formState, { text, textarea }] = useFormState({
    identifier: option.identifier,
    text: option.text
  });

  const handleSubmit = e => {
    console.log("handleSubmit", e);
    const option = {
      identifier: e.values.identifier,
      text: e.values.text
    };

    OptionSchema.isValid(option).then(valid => {
      console.log(valid);
      if (valid) {
        if (e.values.id) {
          updateOption(e.values.id, option)
            .then(response => {
              if (response.status === 204) {
                props.onNewOption(response.data);
                props.setShowNewOptionForm(false);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          createOption(option)
            .then(response => {
              if (response.status === 201) {
                props.onNewOption(response.data);
                props.setShowNewOptionForm(false);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    });
  };

  return (
    <Modal
      title={title}
      visible={props.showNewOptionForm}
      footer={null}
      closable={false}
    >
      <Row>
        <Col span={6}>Identifier</Col>
        <Col span={18}>
          <input
            {...text("identifier")}
            required
            minLength="1"
            className="ant-input"
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={6}>Text</Col>
        <Col span={18}>
          <textarea
            {...textarea("text")}
            required
            minLength="1"
            className="ant-input"
            rows="3"
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={10}></Col>
        <Button type="primary" onClick={() => handleSubmit(formState)}>
          <Icon type="save" />
        </Button>
      </Row>
    </Modal>
  );
};

export default OptionForm;
