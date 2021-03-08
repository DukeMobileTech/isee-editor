import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { Fragment, useContext } from "react";
import * as Yup from "yup";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import {
  createNextQuestion,
  updateNextQuestion,
} from "../../utils/api/next_question";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { valueOperators } from "../../utils/Constants";
import { AlertErrorMessage, DRow, hasNumberResponses } from "../../utils/Utils";

const { Text } = Typography;

const NextQuestionSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question Id is required"),
  question_identifier: Yup.string().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: (val) => val === null || val === "",
    then: Yup.string().required("Option is required"),
  }),
  next_question_identifier: Yup.string().required("Next Question is required"),
});

const NextQuestionForm = (props) => {
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
        complete_survey: nextQuestion.complete_survey || false,
        value_operator: nextQuestion.value_operator || "",
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
          complete_survey: values.complete_survey,
          value_operator: values.value_operator,
        };
        if (editNextQuestion.id) {
          updateNextQuestion(
            props.projectId,
            instrumentQuestion.instrument_id,
            editNextQuestion
          )
            .then((response) => {
              if (response.status === 204) {
                props.fetchNextQuestions();
              }
            })
            .catch((error) => {
              setErrors(error);
            });
        } else {
          createNextQuestion(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            editNextQuestion
          )
            .then((response) => {
              if (response.status === 201) {
                props.fetchNextQuestions();
              }
            })
            .catch((error) => {
              setErrors(error);
            });
        }
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
              <Text strong>Next Question</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="next_question_identifier"
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
