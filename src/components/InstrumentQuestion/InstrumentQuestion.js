import React, { useContext } from "react";
import { Modal, Typography, Col } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { updateInstrumentQuestion } from "../../utils/API";
import { DRow, AlertErrorMessage, RightSubmitButton } from "../../utils/Utils";
import { modalWidth } from "../../utils/Constants";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";

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

  return (
    <Formik
      initialValues={{
        number_in_instrument: iq.number_in_instrument || "",
        identifier: iq.identifier || "",
        display_id: iq.display_id || ""
      }}
      validationSchema={InstrumentQuestionSchema}
      onSubmit={(values, { setErrors }) => {
        const editQuestion = {
          id: iq.id,
          instrument_id: iq.instrument_id,
          number_in_instrument: values.number_in_instrument,
          identifier: values.identifier,
          display_id: values.display_id
        };
        updateInstrumentQuestion(props.projectId, editQuestion)
          .then(response => {
            if (response.status === 204) {
              props.fetchDisplay();
            }
          })
          .catch(error => {
            console.log(error);
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
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

const InstrumentQuestion = props => {
  const instrumentQuestion = props.instrumentQuestion;

  const onCancel = () => {
    props.handleCancel();
  };

  return (
    <Modal
      title={instrumentQuestion.identifier}
      visible={props.visible}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width={modalWidth}
    >
      <InstrumentQuestionForm
        instrumentQuestion={instrumentQuestion}
        displays={props.displays}
        projectId={props.projectId}
        fetchDisplay={props.fetchDisplay}
      />
    </Modal>
  );
};

export default InstrumentQuestion;
