import * as Yup from "yup";

import { RightSubmitButton, LeftCancelButton } from "../../utils/Buttons";
import {
  AlertErrorMessage,
  DRow,
  hasNumberResponses,
  hasSingleResponse
} from "../../utils/Utils";
import { Col, Typography, Select } from "antd";
import { Field, Form, Formik } from "formik";

import React, { useContext, Fragment } from "react";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { valueOperators } from "../../utils/Constants";
import {
  updateConditionSkip,
  createConditionSkip
} from "../../utils/api/condition_skip";

const { Text } = Typography;

const ConditionSkipSchema = Yup.object().shape({
  instrument_question_id: Yup.number().required("Question Id is required"),
  question_identifier: Yup.string().required("Question is required"),
  option_identifier: Yup.string().when("value", {
    is: val => val === null || val === "",
    then: Yup.string().required("Option is required")
  }),
  next_question_identifier: Yup.string().required("Next Question is required")
});

const ConditionSkipForm = props => {
  const conditionSkip = props.conditionSkip;
  const instrumentQuestion = props.instrumentQuestion;
  const display = props.display;
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

  return (
    <Formik
      initialValues={{
        instrument_question_id: instrumentQuestion.id,
        question_identifier: instrumentQuestion.identifier,
        next_question_identifier: conditionSkip.next_question_identifier || "",
        question_identifiers: conditionSkip.question_identifiers
          ? conditionSkip.question_identifiers.split(",")
          : [],
        option_ids: conditionSkip.option_ids
          ? conditionSkip.option_ids.split(",")
          : [],
        values: conditionSkip.values ? conditionSkip.values.split(",") : [],
        value_operators: conditionSkip.value_operators
          ? conditionSkip.value_operators.split(",")
          : []
      }}
      validationSchema={ConditionSkipSchema}
      onSubmit={(values, { setErrors }) => {
        const editConditionSkip = {
          id: conditionSkip.id,
          instrument_question_id: values.instrument_question_id,
          question_identifier: values.question_identifier,
          option_ids: values.option_ids.join(","),
          question_identifiers: values.question_identifiers.join(","),
          values: values.values.join(","),
          value_operators: values.value_operators.join(","),
          next_question_identifier: values.next_question_identifier
        };
        if (editConditionSkip.id) {
          updateConditionSkip(
            props.projectId,
            instrumentQuestion.instrument_id,
            editConditionSkip
          )
            .then(response => {
              if (response.status === 204) {
                props.fetchConditionSkips();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createConditionSkip(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            editConditionSkip
          )
            .then(response => {
              if (response.status === 201) {
                props.fetchConditionSkips();
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
            <Col span={8}>
              <Text strong>Questions</Text>
            </Col>
            <Col span={10}>
              <Field
                name="question_identifiers"
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: '100%' }}
                    mode="multiple"
                    value={values.question_identifiers}
                    onChange={values => {
                      setFieldValue("question_identifiers", values);
                    }}
                  >
                    {instrumentQuestions
                      .filter(
                        iq =>
                          iq.number_in_instrument <=
                          instrumentQuestion.number_in_instrument
                      )
                      .map(iq => {
                        return (
                          <Select.Option
                            key={iq.id}
                            name="question_identifiers"
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
              <AlertErrorMessage name="question_identifiers" type="error" />
            </Col>
          </DRow>
          {hasNumberResponses(instrumentQuestion.question) &&
            values.question_identifiers.map((qid, index) => {
              return (
                <Fragment>
                  <DRow key={qid}>
                    <Col span={8}>
                      <Text strong>{`Value Operator for ${qid}`}</Text>
                    </Col>
                    <Col span={10}>
                      <Field
                        name={`value_operators.${index}`}
                        render={({ field }) => (
                          <Select
                            {...field}
                            style={{ width: '100%' }}
                            value={values.value_operators[index]}
                            onChange={val => {
                              setFieldValue(`value_operators.${index}`, val);
                            }}
                          >
                            {valueOperators.map(operator => {
                              return (
                                <Select.Option
                                  key={operator}
                                  name={`value_operators.${index}`}
                                  value={operator}
                                >
                                  {operator}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        )}
                      />
                    </Col>
                    <Col span={6}>
                      <AlertErrorMessage name="value_operators" type="error" />
                    </Col>
                  </DRow>
                  <DRow>
                    <Col span={8}>
                      <Text strong>{`Value for ${qid}`}</Text>
                    </Col>
                    <Col span={10}>
                      <Field
                        className="ant-input"
                        name={`values.${index}`}
                        type="text"
                      />
                    </Col>
                    <Col span={6}>
                      <AlertErrorMessage name="values" type="error" />
                    </Col>
                  </DRow>
                </Fragment>
              );
            })}
          {hasSingleResponse(instrumentQuestion.question) && (
            <Fragment>
              {values.question_identifiers.map((qid, index) => {
                const iq = display.instrument_questions.find(
                  q => q.identifier === qid
                );
                return (
                  <DRow key={qid}>
                    <Col span={8}>
                      <Text strong>{`Option for ${qid}`}</Text>
                    </Col>
                    <Col span={10}>
                      <Field
                        name={`option_ids.${index}`}
                        render={({ field }) => (
                          <Select
                            {...field}
                            style={{ width: '100%' }}
                            value={values.option_ids[index]}
                            onChange={val => {
                              setFieldValue(`option_ids.${index}`, val);
                            }}
                          >
                            {iq.options.map(option => {
                              return (
                                <Select.Option
                                  key={option.id}
                                  name={`option_ids.${index}`}
                                  value={`${option.id}`}
                                >
                                  {option.identifier}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        )}
                      />
                    </Col>
                    <Col span={6}>
                      <AlertErrorMessage name="option_ids" type="error" />
                    </Col>
                  </DRow>
                );
              })}
            </Fragment>
          )}
          <DRow>
            <Col span={8}>
              <Text strong>Next Question</Text>
            </Col>
            <Col span={10}>
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
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default ConditionSkipForm;
