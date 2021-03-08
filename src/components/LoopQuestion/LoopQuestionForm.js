import { Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import {
  createLoopQuestion,
  updateLoopQuestion,
} from "../../utils/api/loop_question";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";

const { Text } = Typography;

const LoopQuestionSchema = Yup.object().shape({
  looped: Yup.string().required("Question to loop is required"),
});

const LoopQuestionForm = (props) => {
  const loopQuestion = props.loopQuestion;
  const instrumentQuestion = props.instrumentQuestion;
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

  return (
    <Formik
      initialValues={{
        instrument_question_id: instrumentQuestion.id,
        parent: instrumentQuestion.identifier,
        looped: loopQuestion.looped || "",
        option_indices: loopQuestion.option_indices || "",
        same_display: loopQuestion.same_display || false,
        replacement_text: loopQuestion.replacement_text || "",
      }}
      validationSchema={LoopQuestionSchema}
      onSubmit={(values, { setErrors }) => {
        const editLoopQuestion = {
          id: loopQuestion.id,
          instrument_question_id: instrumentQuestion.id,
          parent: values.parent,
          looped: values.looped,
          option_indices: values.option_indices,
          same_display: values.same_display,
          replacement_text: values.replacement_text,
        };
        if (editLoopQuestion.id) {
          updateLoopQuestion(
            props.projectId,
            instrumentQuestion.instrument_id,
            editLoopQuestion
          )
            .then((response) => {
              if (response.status === 204) {
                props.fetchLoopQuestions();
              }
            })
            .catch((error) => {
              setErrors(error);
            });
        } else {
          createLoopQuestion(
            props.projectId,
            instrumentQuestion.instrument_id,
            instrumentQuestion.id,
            editLoopQuestion
          )
            .then((response) => {
              if (response.status === 201) {
                props.fetchLoopQuestions();
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
              <Text strong>Question to loop</Text>
            </Col>
            <Col span={14}>
              <Field className="ant-input" name="looped" component="select">
                <option />
                {instrumentQuestions
                  .filter(
                    (iq) =>
                      iq.number_in_instrument >
                      instrumentQuestion.number_in_instrument
                  )
                  .map((iq) => {
                    return (
                      <option key={iq.id} name="looped" value={iq.identifier}>
                        {`${iq.number_in_instrument} - ${iq.identifier}`}
                      </option>
                    );
                  })}
              </Field>
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="looped" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Replacement Text</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="replacement_text"
                type="text"
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="replacement_text" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Show on same display</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="same_display"
                type="checkbox"
                checked={values.same_display}
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="same_display" type="error" />
            </Col>
          </DRow>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default LoopQuestionForm;
