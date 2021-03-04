import { GreenSubmitButton } from "../../utils/Buttons";
import { DRow, hasMultipleResponses } from "../../utils/Utils";
import { Col, Typography, Select } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";

import { updateInstrumentQuestion } from "../../utils/api/instrument_question";
import { skipOperationTypes, ANY_AND_NO_OTHER } from "../../utils/Constants";

const { Text } = Typography;

const IQForm = props => {
  const iq = props.instrumentQuestion;
  const skip_options = [];
  props.multipleSkips.forEach(nq => {
    const option = iq.options.find(
      op => op.identifier === nq.option_identifier
    );
    if (option) skip_options.push(option.id);
  });
  const [neutralIds, setNeutralIds] = useState(
    iq.multiple_skip_neutral_ids === null || iq.multiple_skip_neutral_ids === ""
      ? []
      : iq.multiple_skip_neutral_ids.split(",")
  );
  const [nextInitialState, setNextInitialState] = useState({});

  return (
    <Formik
      initialValues={{
        multiple_skip_operator: iq.multiple_skip_operator || "",
        multiple_skip_neutral_ids: neutralIds
      }}
      nextInitialState={nextInitialState}
      onSubmit={(values, { resetForm }) => {
        const editQuestion = {
          id: iq.id,
          instrument_id: iq.instrument_id,
          multiple_skip_operator: values.multiple_skip_operator,
          multiple_skip_neutral_ids: values.multiple_skip_neutral_ids
        };
        updateInstrumentQuestion(props.projectId, editQuestion).then(
          response => {
            setNextInitialState({
              multiple_skip_operator: response.multiple_skip_operator,
              multiple_skip_neutral_ids: response.multiple_skip_neutral_ids
            });
            resetForm();
          }
        );
      }}
      render={({ values, dirty, setFieldValue }) => (
        <Form>
          {hasMultipleResponses(iq.question) && (
            <DRow>
              <Col span={4}>
                <Text strong>Skip Operation Type</Text>
              </Col>
              <Col span={18}>
                <Field
                  className="ant-input"
                  name="multiple_skip_operator"
                  component="select"
                >
                  <option></option>
                  {skipOperationTypes.map(operation => {
                    return (
                      <option
                        key={operation}
                        name="multiple_skip_operator"
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
          {values.multiple_skip_operator === ANY_AND_NO_OTHER && (
            <DRow>
              <Col span={4}>
                <Text strong>Neutral Options (excluded from AND_NO_OTHER)</Text>
              </Col>
              <Col span={18}>
                <Field
                  name={`multiple_skip_neutral_ids`}
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
                          `multiple_skip_neutral_ids`,
                          selectedIds.join(",")
                        );
                      }}
                    >
                      <Select.Option value=""></Select.Option>
                      {iq.options.map((option, idx) => {
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
