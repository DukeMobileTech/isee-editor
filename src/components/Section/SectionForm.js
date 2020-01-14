import * as Yup from "yup";

import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage } from "../../utils/Utils";
import { Field, Form, Formik } from "formik";
import { createSection, updateSection } from "../../utils/api/section";

import { Form as AntForm } from "antd";
import { CenteredH4 } from "../../utils/Styles";
import React from "react";

const FormItem = AntForm.Item;

const SectionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const SectionForm = props => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.instrument.id;
  const section = props.section;

  return (
    <Formik
      initialValues={{
        id: (section && section.id) || null,
        title: (section && section.title) || "",
        instrument_id: (section && section.instrument_id) || instrumentId,
        position:
          (section && section.position) || props.instrument.section_count + 1
      }}
      validationSchema={SectionSchema}
      onSubmit={(values, { setErrors }) => {
        const section = {
          id: values.id,
          title: values.title,
          instrument_id: values.instrument_id,
          position: values.position
        };
        if (values.id) {
          updateSection(projectId, values.instrument_id, values.id, section)
            .then(response => {
              props.fetchSections();
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
              props.fetchSections();
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
