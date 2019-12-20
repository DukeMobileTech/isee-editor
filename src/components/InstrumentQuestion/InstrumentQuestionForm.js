import * as Yup from "yup";

import { RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";

import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import { updateInstrumentQuestion } from "../../utils/api/instrument_question";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";

const { Text } = Typography;
const InstrumentQuestionSchema = Yup.object().shape({
  number_in_instrument: Yup.number().required("Position is required"),
  identifier: Yup.string().required("Identifier is required"),
  display_id: Yup.number().required("Subsection is required")
});

const InstrumentQuestionForm = props => {
  const iq = props.instrumentQuestion;
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const displays = [].concat.apply([], sections.map(sec => sec.displays));
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

  const hasMultipleResponses = question => {
    return (
      question.question_type === "SELECT_MULTIPLE" ||
      question.question_type === "SELECT_MULTIPLE_WRITE_OTHER" ||
      question.question_type === "LIST_OF_TEXT_BOXES" ||
      question.question_type === "LIST_OF_INTEGER_BOXES"
    );
  };

  return (
    <Formik
      initialValues={{
        number_in_instrument: iq.number_in_instrument || "",
        identifier: iq.identifier || "",
        display_id: iq.display_id || "",
        carry_forward_identifier: iq.carry_forward_identifier || ""
      }}
      validationSchema={InstrumentQuestionSchema}
      onSubmit={(values, { setErrors }) => {
        const editQuestion = {
          id: iq.id,
          instrument_id: iq.instrument_id,
          number_in_instrument: values.number_in_instrument,
          identifier: values.identifier,
          display_id: values.display_id,
          carry_forward_identifier: values.carry_forward_identifier
        };
        updateInstrumentQuestion(props.projectId, editQuestion)
          .then(response => {
            if (response.status === 204) {
              props.fetchDisplay();
            }
          })
          .catch(error => {
            setErrors(error);
          });
      }}
      render={({ values }) => (
        <Form>
          <DRow>
            <Col span={4}>
              <Text strong>Identifier</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="identifier"
                placeholder="Enter unique identifier"
                type="text"
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="identifier" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Number</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="number_in_instrument"
                placeholder="Enter question number"
                type="number"
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="number_in_instrument" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Subsection</Text>
            </Col>
            <Col span={14}>
              <Field className="ant-input" name="display_id" component="select">
                <option></option>
                {displays.map(display => {
                  return (
                    <option
                      key={display.id}
                      name="display_id"
                      value={display.id}
                    >
                      {display.title}
                    </option>
                  );
                })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="display_id" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Use Responses From</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="carry_forward_identifier"
                component="select"
              >
                <option></option>
                {instrumentQuestions
                  .filter(
                    question =>
                      question.number_in_instrument < iq.number_in_instrument &&
                      hasMultipleResponses(question)
                  )
                  .map(instrumentQuestion => {
                    return (
                      <option
                        key={instrumentQuestion.id}
                        name="carry_forward_identifier"
                        value={instrumentQuestion.identifier}
                      >
                        {instrumentQuestion.identifier}
                      </option>
                    );
                  })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="carry_forward_identifier" type="error" />
            </Col>
          </DRow>
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default InstrumentQuestionForm;
