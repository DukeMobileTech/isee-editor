import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import { updateInstrumentQuestion } from "../../utils/api/instrument_question";
import { RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";

const { Text } = Typography;
const InstrumentQuestionSchema = Yup.object().shape({
  identifier: Yup.string().required("Identifier is required"),
  display_id: Yup.number().required("Subsection is required"),
});

const InstrumentQuestionForm = (props) => {
  const iq = props.instrumentQuestion;
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const displays = [].concat(...sections.map((sec) => sec.displays));
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

  const hasMultipleResponses = (question) => {
    return (
      question.question_type === "SELECT_MULTIPLE" ||
      question.question_type === "SELECT_MULTIPLE_WRITE_OTHER" ||
      question.question_type === "LIST_OF_TEXT_BOXES" ||
      question.question_type === "LIST_OF_INTEGER_BOXES" ||
      question.question_type === "CHOICE_TASK"
    );
  };

  return (
    <Formik
      initialValues={{
        identifier: iq.identifier || "",
        display_id: iq.display_id || "",
        carry_forward_identifier: iq.carry_forward_identifier || "",
        show_number: iq.show_number || true,
      }}
      validationSchema={InstrumentQuestionSchema}
      onSubmit={(values, { setErrors }) => {
        const editQuestion = {
          id: iq.id,
          instrument_id: iq.instrument_id,
          identifier: values.identifier,
          display_id: values.display_id,
          carry_forward_identifier: values.carry_forward_identifier,
          show_number: values.show_number,
        };
        updateInstrumentQuestion(props.projectId, editQuestion)
          .then((response) => {
            props.fetchDisplay();
          })
          .catch((error) => {
            for (const err of error.data.errors) {
              if (err.includes("Identifier")) {
                setErrors({ identifier: err });
              }
            }
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
              <Text strong>Subsection</Text>
            </Col>
            <Col span={14}>
              <Field className="ant-input" name="display_id" component="select">
                <option />
                {displays.map((display) => {
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
                <option />
                {instrumentQuestions
                  .filter(
                    (question) =>
                      question.number_in_instrument < iq.number_in_instrument &&
                      hasMultipleResponses(question)
                  )
                  .map((instrumentQuestion) => {
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
          <DRow>
            <Col span={6}>
              <Text strong>Show Question Number</Text>
            </Col>
            <Col span={18}>
              <Field
                name="show_number"
                type="checkbox"
                checked={values.show_number}
              />
            </Col>
          </DRow>
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default InstrumentQuestionForm;
