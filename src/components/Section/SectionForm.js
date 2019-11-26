import * as Yup from "yup";

import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";
import { Field, Form, Formik } from "formik";
import { createSection, updateSection } from "../../utils/api/section";

import { Form as AntForm } from "antd";
import { CenteredH4 } from "../../utils/Styles";
import React from "react";

const FormItem = AntForm.Item;

const SectionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  position: Yup.number()
    .min(1, "Number must be greater than 0")
    .required("Postion is required")
});

const SectionForm = props => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.instrument.id;
  const section = props.section;
  const maxCount = props.maxCount;

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
