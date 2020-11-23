import * as Yup from "yup";

import { RightSubmitButton, LeftCancelButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Col, Select, Typography } from "antd";
import { Field, Form, Formik } from "formik";

import React, { useContext } from "react";
import { createRedFlag, updateRedFlag } from "../../utils/api/red_flag";
import { InstructionContext } from "../../context/InstructionContext";

const { Text } = Typography;
const { Option } = Select;

const RedFlagSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: val => val === null || val === "",
    then: Yup.string().required("Option is required")
  }),
  instruction_id: Yup.number().required("Instruction is required")
});

const RedFlagForm = props => {
  const redFlag = props.redFlag;
  const instrumentQuestion = props.instrumentQuestion;
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);

  return (
    <Formik
      initialValues={{
        instrument_question_id: instrumentQuestion.id,
        option_identifier: redFlag.option_identifier || "",
        instruction_id: redFlag.instruction_id || "",
        selected: redFlag.selected || true
      }}
      validationSchema={RedFlagSchema}
      onSubmit={(values, { setErrors }) => {
        const editRedFlag = {
          id: redFlag.id,
          instrument_question_id: values.instrument_question_id,
          option_identifier: values.option_identifier,
          instruction_id: values.instruction_id,
          selected: values.selected
        };
        if (editRedFlag.id) {
          updateRedFlag(
            props.projectId,
            instrumentQuestion.instrument_id,
            editRedFlag
          )
            .then(response => {
              if (response.status === 204) {
                props.fetchRedFlags();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createRedFlag(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            editRedFlag
          )
            .then(response => {
              if (response.status === 201) {
                props.fetchRedFlags();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        }
      }}
      render={({ values, setFieldValue }) => (
        <Form>
          <DRow>
            <Col span={4}>
              <Text strong>Option</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="option_identifier"
                component="select"
              >
                <option></option>
                {instrumentQuestion.options.map(option => {
                  return (
                    <option
                      key={option.id}
                      name="option_identifier"
                      value={option.identifier}
                    >
                      {option.text.replace(/<[^>]+>/g, "")}
                    </option>
                  );
                })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="option_identifier" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Instructions</Text>
            </Col>
            <Col span={20}>
              <Field
                name="instruction_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    onChange={value => {
                      if (value === undefined) {
                        value = null;
                      }
                      setFieldValue("instruction_id", value);
                    }}
                    filterOption={(input, option) =>
                      option.props.children &&
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value=""></Option>
                    {instructions.map(instruction => {
                      return (
                        <Option
                          key={instruction.id}
                          name="instruction_id"
                          value={instruction.id}
                        >
                          {instruction.title.replace(/<[^>]+>/g, "")}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Selected</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="selected"
                type="checkbox"
                checked={values.selected}
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="selected" type="error" />
            </Col>
          </DRow>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default RedFlagForm;
