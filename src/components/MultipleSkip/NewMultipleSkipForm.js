import * as Yup from "yup";

import { RightSubmitButton, LeftCancelButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow, hasNumberResponses } from "../../utils/Utils";
import { Col, Typography, Select } from "antd";
import { Field, Form, Formik } from "formik";

import React, { useContext, Fragment } from "react";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { createMultipleSkip } from "../../utils/api/multiple_skip";
import { valueOperators } from "../../utils/Constants";

const { Text } = Typography;

const MultipleSkipSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question Id is required"),
  question_identifier: Yup.string().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: val => val === null || val === "",
    then: Yup.string().required("Option is required")
  }),
  skipQuestionIdentifiers: Yup.string().required("Question to skip is required")
});

const NewMultipleSkipForm = props => {
  const instrumentQuestion = props.instrumentQuestion;
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

  return (
    <Formik
      initialValues={{
        instrument_question_id: instrumentQuestion.id,
        question_identifier: instrumentQuestion.identifier,
        option_identifier: "",
        value: "",
        skipQuestionIdentifiers: [],
        value_operator: ""
      }}
      validationSchema={MultipleSkipSchema}
      onSubmit={values => {
        let count = 0;
        values.skipQuestionIdentifiers.forEach(qid => {
          const multipleSkip = {
            instrument_question_id: values.instrument_question_id,
            question_identifier: values.question_identifier,
            option_identifier: values.option_identifier,
            value: values.value,
            skip_question_identifier: qid,
            value_operator: values.value_operator
          };
          createMultipleSkip(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            multipleSkip
          ).then(response => {
            count += 1;
            if (count === values.skipQuestionIdentifiers.length) {
              props.fetchMultipleSkips();
            }
          });
        });
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
          {hasNumberResponses(instrumentQuestion.question) && (
            <Fragment>
              <DRow>
                <Col span={4}>
                  <Text strong>Value Operator</Text>
                </Col>
                <Col span={14}>
                  <Field
                    className="ant-input"
                    name="value_operator"
                    component="select"
                  >
                    <option key="EMPTY"></option>
                    {valueOperators.map(operator => {
                      return (
                        <option
                          key={operator}
                          name="value_operator"
                          value={operator}
                        >
                          {operator}
                        </option>
                      );
                    })}
                  </Field>
                </Col>
                <Col span={6}>
                  <AlertErrorMessage name="value_operator" type="error" />
                </Col>
              </DRow>
              <DRow>
                <Col span={4}>
                  <Text strong>Value</Text>
                </Col>
                <Col span={14}>
                  <Field className="ant-input" name="value" type="text" />
                </Col>
                <Col span={6}>
                  <AlertErrorMessage name="value" type="error" />
                </Col>
              </DRow>
            </Fragment>
          )}
          <DRow>
            <Col span={4}>
              <Text strong>Questions To Skip</Text>
            </Col>
            <Col span={14}>
              <Field
                name="skipQuestionIdentifiers"
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: '100%' }}
                    mode="multiple"
                    onChange={values => {
                      setFieldValue("skipQuestionIdentifiers", values);
                    }}
                  >
                    {instrumentQuestions
                      .filter(
                        iq =>
                          iq.number_in_instrument >
                          instrumentQuestion.number_in_instrument
                      )
                      .map(iq => {
                        return (
                          <Select.Option
                            key={iq.id}
                            name="skipQuestionIdentifiers"
                            value={iq.identifier}
                          >
                            {iq.identifier}
                          </Select.Option>
                        );
                      })}
                  </Select>
                )}
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="skipQuestionIdentifiers" type="error" />
            </Col>
          </DRow>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default NewMultipleSkipForm;
