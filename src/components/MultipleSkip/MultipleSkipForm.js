import * as Yup from "yup";

import { RightSubmitButton, LeftCancelButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";

import React, { useContext } from "react";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import {
  updateMultipleSkip,
  createMultipleSkip
} from "../../utils/api/multiple_skip";

const { Text } = Typography;

const MultipleSkipSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question Id is required"),
  question_identifier: Yup.string().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: val => val === null || val === "",
    then: Yup.string().required("Option is required")
  }),
  skip_question_identifier: Yup.string().required(
    "Question to skip is required"
  )
});

const MultipleSkipForm = props => {
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
        skip_question_identifier: multipleSkip.skip_question_identifier || ""
      }}
      validationSchema={MultipleSkipSchema}
      onSubmit={(values, { setErrors }) => {
        const editMultipleSkip = {
          id: multipleSkip.id,
          instrument_question_id: values.instrument_question_id,
          question_identifier: values.question_identifier,
          option_identifier: values.option_identifier,
          value: values.value,
          skip_question_identifier: values.skip_question_identifier
        };
        if (editMultipleSkip.id) {
          updateMultipleSkip(
            props.projectId,
            instrumentQuestion.instrument_id,
            editMultipleSkip
          )
            .then(response => {
              if (response.status === 204) {
                props.fetchMultipleSkips();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createMultipleSkip(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            editMultipleSkip
          )
            .then(response => {
              if (response.status === 201) {
                props.fetchMultipleSkips();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        }
      }}
      render={({ values }) => (
        <Form>
          {(values.value === null || values.value === "") && (
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
          )}
          {(values.option_identifier === null ||
            values.option_identifier === "") && (
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
                <option></option>
                {instrumentQuestions
                  .filter(
                    iq =>
                      iq.number_in_instrument >
                      instrumentQuestion.number_in_instrument
                  )
                  .map(iq => {
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
