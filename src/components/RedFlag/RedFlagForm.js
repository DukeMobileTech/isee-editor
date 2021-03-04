import * as Yup from "yup";

import { RightSubmitButton, LeftCancelButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Col, Select, Typography } from "antd";
import { Field, Form, Formik } from "formik";

import React, { useContext } from "react";
import { createRedFlag, updateRedFlag } from "../../utils/api/red_flag";
import { InstructionContext } from "../../context/InstructionContext";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { OptionSetContext } from "../../context/OptionSetContext";

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
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const redFlag = props.redFlag;
  const scoreScheme = props.scoreScheme;
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);

  return (
    <Formik
      initialValues={{
        id: (redFlag && redFlag.id) || "",
        instrument_question_id:
          (redFlag && redFlag.instrument_question_id) || "",
        score_scheme_id: (redFlag && redFlag.score_scheme_id) || scoreScheme.id,
        option_identifier: (redFlag && redFlag.option_identifier) || "",
        instruction_id: (redFlag && redFlag.instruction_id) || "",
        selected: redFlag ? redFlag.selected : true
      }}
      validationSchema={RedFlagSchema}
      onSubmit={(values, { setErrors }) => {
        const editRedFlag = {
          id: values.id,
          instrument_question_id: values.instrument_question_id,
          score_scheme_id: values.score_scheme_id,
          option_identifier: values.option_identifier,
          instruction_id: values.instruction_id,
          selected: values.selected
        };
        if (editRedFlag.id) {
          updateRedFlag(projectId, instrumentId, scoreScheme.id, editRedFlag)
            .then(response => {
              if (response.status === 204) {
                props.fetchRedFlags();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createRedFlag(projectId, instrumentId, scoreScheme.id, editRedFlag)
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
              <Text strong>Question</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="instrument_question_id"
                component="select"
              >
                <option></option>
                {instrumentQuestions &&
                  instrumentQuestions.map(iq => {
                    return (
                      <option
                        key={iq.id}
                        name="instrument_question_id"
                        value={iq.id}
                      >
                        {iq.identifier}
                      </option>
                    );
                  })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="instrument_question_id" type="error" />
            </Col>
          </DRow>
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
                {values.instrument_question_id &&
                  optionSets &&
                  optionSets
                    .find(
                      os =>
                        os.id ===
                        instrumentQuestions.find(
                          iq => iq.id === Number(values.instrument_question_id)
                        ).option_set_id
                    )
                    .option_in_option_sets.map(oios => {
                      return (
                        <option
                          key={oios.option.id}
                          name="option_identifier"
                          value={oios.option.identifier}
                        >
                          {oios.option.text.replace(/<[^>]+>/g, "")}
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
                    style={{ width: '100%' }}
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
