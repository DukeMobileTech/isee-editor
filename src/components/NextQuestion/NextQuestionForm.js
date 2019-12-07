import * as Yup from "yup";

import {
  AlertErrorMessage,
  DRow,
  RightSubmitButton,
  LeftCancelButton
} from "../../utils/Utils";
import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import {
  createNextQuestion,
  updateNextQuestion
} from "../../utils/api/next_question";

import React, { useContext } from "react";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";

const { Text } = Typography;

const NextQuestionSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question Id is required"),
  question_identifier: Yup.string().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: val => val === null || val === "",
    then: Yup.string().required("Option is required")
  }),
  next_question_identifier: Yup.string().when("complete_survey", {
    is: val => val === false || val === "",
    then: Yup.string().required("Next Question is required")
  })
});

const NextQuestionForm = props => {
  const nextQuestion = props.nextQuestion;
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
        option_identifier: nextQuestion.option_identifier || "",
        value: nextQuestion.value || "",
        next_question_identifier: nextQuestion.next_question_identifier || "",
        complete_survey: nextQuestion.complete_survey || false
      }}
      validationSchema={NextQuestionSchema}
      onSubmit={(values, { setErrors }) => {
        const editNextQuestion = {
          id: nextQuestion.id,
          instrument_question_id: values.instrument_question_id,
          question_identifier: values.question_identifier,
          option_identifier: values.option_identifier,
          value: values.value,
          next_question_identifier: values.next_question_identifier,
          complete_survey: values.complete_survey
        };
        if (editNextQuestion.id) {
          updateNextQuestion(
            props.projectId,
            instrumentQuestion.instrument_id,
            editNextQuestion
          )
            .then(response => {
              if (response.status === 204) {
                props.fetchNextQuestions();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createNextQuestion(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            editNextQuestion
          )
            .then(response => {
              if (response.status === 201) {
                props.fetchNextQuestions();
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
                        {option.text}
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
              <Text strong>Next Question</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="next_question_identifier"
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
                        name="next_question_identifier"
                        value={iq.identifier}
                      >
                        {iq.identifier}
                      </option>
                    );
                  })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="next_question_identifier" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Finish Survey</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="complete_survey"
                type="checkbox"
                checked={values.complete_survey}
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="complete_survey" type="error" />
            </Col>
          </DRow>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default NextQuestionForm;