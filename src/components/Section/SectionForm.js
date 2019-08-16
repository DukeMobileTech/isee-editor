import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm } from "antd";
import * as Yup from "yup";
import { createSection, updateSection } from "../../utils/API";
import { CenteredH4 } from "../../utils/Styles";
import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";

const FormItem = AntForm.Item;

const SectionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  position: Yup.number()
    .min(1, "Number must be greater than 0")
    // .max(maxCount, "Number cannot exceed the current number of sections")
    .required("Postion is required")
});

const SectionForm = props => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.instrument.id;
  const section = props.section;
  const maxCount = props.sectionCount ? props.sectionCount + 1 : 1;

  return (
    <Formik
      initialValues={{
        id: (section && section.id) || null,
        title: (section && section.title) || "",
        instrument_id: (section && section.instrument_id) || instrumentId,
        position: (section && section.position) || maxCount
      }}
      validationSchema={SectionSchema}
      onSubmit={(values, { setErrors }) => {
        const section = {
          title: values.title,
          instrument_id: values.instrument_id,
          position: values.position
        };
        if (values.id) {
          updateSection(projectId, values.instrument_id, values.id, section)
            .then(response => {
              if (response.status === 204) {
                props.fetchUpdatedSections();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                }
              }
            });
        } else {
          createSection(projectId, values.instrument_id, section)
            .then(response => {
              if (response.status === 201) {
                props.fetchUpdatedSections();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                }
              }
            });
        }
      }}
      render={({ values }) => (
        <Form className="ant-form ant-form-horizontal">
          <CenteredH4>{values.title ? values.title : "New Section"}</CenteredH4>
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

export default SectionForm;
