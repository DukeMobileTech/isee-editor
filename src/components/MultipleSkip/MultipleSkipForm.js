import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { Fragment, useContext } from "react";
import * as Yup from "yup";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { updateMultipleSkip } from "../../utils/api/multiple_skip";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { valueOperators } from "../../utils/Constants";
import { AlertErrorMessage, DRow, hasNumberResponses } from "../../utils/Utils";

const { Text } = Typography;

const MultipleSkipSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question Id is required"),
  question_identifier: Yup.string().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: (val) => val === null || val === "",
    then: Yup.string().required("Option is required"),
  }),
  skip_question_identifier: Yup.string().required(
    "Question to skip is required"
  ),
});

const MultipleSkipForm = (props) => {
  const multipleSkip = props.multipleSkip;
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
        option_identifier: multipleSkip.option_identifier || "",
        value: multipleSkip.value || "",
        skip_question_identifier: multipleSkip.skip_question_identifier || "",
        value_operator: multipleSkip.value_operator || "",
      }}
      validationSchema={MultipleSkipSchema}
      onSubmit={(values, { setErrors }) => {
        const editMultipleSkip = {
          id: multipleSkip.id,
          instrument_question_id: values.instrument_question_id,
          question_identifier: values.question_identifier,
          option_identifier: values.option_identifier,
          value: values.value,
          skip_question_identifier: values.skip_question_identifier,
          value_operator: values.value_operator,
        };
        updateMultipleSkip(
          props.projectId,
          instrumentQuestion.instrument_id,
          editMultipleSkip
        )
          .then((response) => {
            if (response.status === 204) {
              props.fetchMultipleSkips();
            }
          })
          .catch((error) => {
            setErrors(error);
          });
      }}
      render={({ values }) => (
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
                <option />
                {instrumentQuestion.options.map((option) => {
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
                    <option key="EMPTY" />
                    {valueOperators.map((operator) => {
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
              <Text strong>Question To Skip</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="skip_question_identifier"
                component="select"
              >
                <option />
                {instrumentQuestions
                  .filter(
                    (iq) =>
                      iq.number_in_instrument >
                      instrumentQuestion.number_in_instrument
                  )
                  .map((iq) => {
                    return (
                      <option
                        key={iq.id}
                        name="skip_question_identifier"
                        value={iq.identifier}
                      >
                        {iq.identifier}
                      </option>
                    );
                  })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="skip_question_identifier" type="error" />
            </Col>
          </DRow>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default MultipleSkipForm;
