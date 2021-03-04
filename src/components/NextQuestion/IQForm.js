import { GreenSubmitButton } from "../../utils/Buttons";
import { DRow, hasMultipleResponses } from "../../utils/Utils";
import { Col, Typography, Select } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";

import { updateInstrumentQuestion } from "../../utils/api/instrument_question";
import { skipOperationTypes, ANY_AND_NO_OTHER } from "../../utils/Constants";

const { Text } = Typography;

const IQForm = props => {
  const [iq, setIq] = useState(props.instrumentQuestion);
  const [neutralIds, setNeutralIds] = useState(
    props.instrumentQuestion.next_question_neutral_ids === null ||
      props.instrumentQuestion.next_question_neutral_ids === ""
      ? []
      : props.instrumentQuestion.next_question_neutral_ids.split(",")
  );
  const [nextInitialState, setNextInitialState] = useState({});
  const skip_options = [];
  props.nextQuestions.forEach(nq => {
    const option = props.instrumentQuestion.options.find(
      op => op.identifier === nq.option_identifier
    );
    if (option) skip_options.push(option.id);
  });

  return (
    <Formik
      initialValues={{
        next_question_operator: iq.next_question_operator || "",
        next_question_neutral_ids: neutralIds
      }}
      nextInitialState={nextInitialState}
      onSubmit={(values, { resetForm }) => {
        const editQuestion = {
          id: iq.id,
          instrument_id: iq.instrument_id,
          next_question_operator: values.next_question_operator,
          next_question_neutral_ids: values.next_question_neutral_ids
        };
        updateInstrumentQuestion(props.projectId, editQuestion).then(
          response => {
            setIq(response);
            setNextInitialState({
              next_question_operator: response.next_question_operator,
              next_question_neutral_ids: response.next_question_neutral_ids
            });
            resetForm();
          }
        );
      }}
      render={({ values, dirty, setFieldValue }) => (
        <Form>
          {hasMultipleResponses(props.instrumentQuestion.question) && (
            <DRow>
              <Col span={4}>
                <Text strong>Skip Operation Type</Text>
              </Col>
              <Col span={18}>
                <Field
                  className="ant-input"
                  name="next_question_operator"
                  component="select"
                >
                  <option></option>
                  {skipOperationTypes.map(operation => {
                    return (
                      <option
                        key={operation}
                        name="next_question_operator"
                        value={operation}
                      >
                        {operation}
                      </option>
                    );
                  })}
                </Field>
              </Col>
            </DRow>
          )}
          {values.next_question_operator === ANY_AND_NO_OTHER && (
            <DRow>
              <Col span={4}>
                <Text strong>Neutral Options (excluded from AND_NO_OTHER)</Text>
              </Col>
              <Col span={18}>
                <Field
                  name={`next_question_neutral_ids`}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: '100%' }}
                      mode="multiple"
                      value={neutralIds}
                      onChange={values => {
                        const selectedIds = [
                          ...new Set(
                            values
                              .join(",")
                              .replace(/(^[,\s]+)|([,\s]+$)/g, "")
                              .split(",")
                              .filter(val => !skip_options.includes(val))
                          )
                        ];
                        setNeutralIds(selectedIds);
                        setFieldValue(
                          `next_question_neutral_ids`,
                          selectedIds.join(",")
                        );
                      }}
                    >
                      <Select.Option value=""></Select.Option>
                      {props.instrumentQuestion.options.map((option, idx) => {
                        return (
                          <Select.Option key={option.id} value={`${option.id}`}>
                            {option.text.replace(/<[^>]+>/g, "")}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                />
              </Col>
            </DRow>
          )}
          {dirty && <GreenSubmitButton />}
        </Form>
      )}
    />
  );
};

export default IQForm;
