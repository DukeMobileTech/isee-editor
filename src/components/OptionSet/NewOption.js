import * as Yup from "yup";

import { Button, Col, Icon, Modal, Row } from "antd";

import React from "react";
import { createOption } from "../../utils/api/option";
import { useFormState } from "react-use-form-state";

const OptionSchema = Yup.object().shape({
  identifier: Yup.string().required("Identifier is required"),
  text: Yup.string().required("Text is required")
});

const NewOption = props => {
  const options = props.options;
  const optionSet = props.optionSet;
  const values = props.values;

  const [formState, { text, textarea }] = useFormState({
    identifier: "",
    text: ""
  });

  const handleSubmit = e => {
    let option = {
      identifier: e.values.identifier,
      text: e.values.text
    };

    OptionSchema.isValid(option).then(valid => {
      if (valid) {
        createOption(option)
          .then(response => {
            if (response.status === 201) {
              option = response.data;
              props.setOptions([...options, option]);
              const exists = optionSet.option_in_option_sets.find(
                os => os.option_id === option.id
              );
              if (exists === undefined) {
                optionSet.option_in_option_sets.push({
                  option_id: option.id,
                  option_set_id: optionSet.id,
                  number_in_question:
                    optionSet.option_in_option_sets.length + 1,
                  special: false,
                  option: option
                });
                props.resetForm({
                  id: values.id,
                  title: values.title,
                  instruction_id: values.instruction_id,
                  special: values.special,
                  option_in_option_sets: optionSet.option_in_option_sets
                });
              }
              props.setShowNewOptionForm(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  const onCancel = () => {
    props.setShowNewOptionForm(false);
  };

  return (
    <Modal
      title="New Option"
      visible={props.showNewOptionForm}
      footer={null}
      onCancel={onCancel}
      destroyOnClose={true}
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

export default NewOption;
