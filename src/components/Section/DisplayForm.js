import { Form as AntForm } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import { createDisplay, updateDisplay } from "../../utils/api/display";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage } from "../../utils/Utils";

const FormItem = AntForm.Item;

const DisplaySchema = Yup.object().shape({
  section_id: Yup.number().required("Section is required"),
  title: Yup.string().required("Title is required"),
});

const DisplayForm = (props) => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.section.instrument_id;
  const sectionId = props.section.id;
  const display = props.display;
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);

  return (
    <Formik
      initialValues={{
        id: (display && display.id) || null,
        title: (display && display.title) || "",
        instrument_id: (display && display.instrument_id) || instrumentId,
        section_id: (display && display.section_id) || sectionId,
        position: (display && display.position) || props.section.display_count,
      }}
      validationSchema={DisplaySchema}
      onSubmit={(values, { setErrors }) => {
        const display = {
          title: values.title,
          instrument_id: values.instrument_id,
          position: values.position,
          section_id: values.section_id,
        };
        if (values.id) {
          updateDisplay(projectId, values.instrument_id, values.id, display)
            .then((response) => {
              props.fetchSections();
            })
            .catch((error) => {
              for (const err of error.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        } else {
          createDisplay(projectId, values.instrument_id, display)
            .then((response) => {
              props.fetchSections();
            })
            .catch((error) => {
              for (const err of error.data.errors) {
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
          <FormItem>
            <Field className="ant-input" name="section_id" component="select">
              <option />
              {sections.map((section) => {
                return (
                  <option key={section.id} name="section_id" value={section.id}>
                    {section.title}
                  </option>
                );
              })}
            </Field>
            <AlertErrorMessage name="section_id" type="error" />
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
