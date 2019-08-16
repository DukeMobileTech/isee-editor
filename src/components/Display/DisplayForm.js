import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm } from "antd";
import * as Yup from "yup";
import { createDisplay, updateDisplay } from "../../utils/API";
import { CenteredH4 } from "../../utils/Styles";
import {
  AlertErrorMessage,
  RightSubmitButton,
  LeftCancelButton
} from "../../utils/Utils";

const FormItem = AntForm.Item;

const DisplaySchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  position: Yup.number()
    .min(1, "Number must be greater than 0")
    // .max(maxCount, "Number cannot exceed the current number of sections")
    .required("Postion is required")
});

const DisplayForm = props => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.section.instrument_id;
  const sectionId = props.section.id;
  const display = props.display;
  const displayPosition = props.lastDisplayPosition + 1;

  return (
    <Formik
      initialValues={{
        id: (display && display.id) || null,
        title: (display && display.title) || "",
        instrument_id: (display && display.instrument_id) || instrumentId,
        section_id: (display && display.section_id) || sectionId,
        position: (display && display.position) || displayPosition
      }}
      validationSchema={DisplaySchema}
      onSubmit={(values, { setErrors }) => {
        const display = {
          title: values.title,
          instrument_id: values.instrument_id,
          position: values.position,
          section_id: values.section_id
        };
        if (values.id) {
          updateDisplay(projectId, values.instrument_id, values.id, display)
            .then(response => {
              if (response.status === 204) {
                props.fetchUpdatedDisplays();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        } else {
          createDisplay(projectId, values.instrument_id, display)
            .then(response => {
              if (response.status === 201) {
                props.fetchUpdatedDisplays();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        }
      }}
      render={({ values }) => (
        <Form className="ant-form ant-form-horizontal">
          <CenteredH4>
            {values.title ? values.title : "New Subsection"}
          </CenteredH4>
          <FormItem>
            <Field
              className="ant-input"
              name="position"
              placeholder="Enter position"
              type="number"
            />
            <AlertErrorMessage name="position" type="error" />
          </FormItem>
          <FormItem>
            <Field
              className="ant-input"
              name="title"
              placeholder="Enter title"
              type="text"
            />
            <AlertErrorMessage name="title" type="error" />
          </FormItem>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default DisplayForm;
