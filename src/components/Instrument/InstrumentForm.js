import * as Yup from "yup";

import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { createInstrument, updateInstrument } from "../../utils/api/instrument";

import { Form as AntForm } from "antd";
import { CenteredH4 } from "../../utils/Styles";
import { ProjectContext } from "../../context/ProjectContext";
import { languages } from "../../utils/Constants";

const FormItem = AntForm.Item;

const InstrumentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  language: Yup.string().required("Language is required"),
  project_id: Yup.string().required("Project is required")
});

const InstrumentForm = props => {
  const projects = useContext(ProjectContext);
  const instrument = props.instrument ? props.instrument : null;

  return (
    <Formik
      initialValues={{
        id: (instrument && instrument.id) || null,
        title: (instrument && instrument.title) || "",
        project_id: (instrument && instrument.project_id) || "",
        language: (instrument && instrument.language) || "",
        published: (instrument && instrument.published) || false
      }}
      validationSchema={InstrumentSchema}
      onSubmit={(values, { setErrors }) => {
        const instrument = {
          title: values.title,
          project_id: values.project_id,
          language: values.language,
          published: values.published
        };
        if (values.id) {
          updateInstrument(values.project_id, values.id, instrument)
            .then(response => {
              if (response.status === 204) {
                props.fetchInstruments();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createInstrument(values.project_id, instrument)
            .then(response => {
              if (response.status === 201) {
                props.fetchInstruments();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        }
      }}
      render={({ errors, values, touched }) => (
        <Form>
          <CenteredH4>
            {values.title ? values.title : "New Instrument"}
          </CenteredH4>
          <FormItem>
            <Field
              className="ant-input"
              name="title"
              placeholder="Enter title"
              type="text"
            />
            <AlertErrorMessage name="title" type="error" />
          </FormItem>
          <FormItem>
            <Field className="ant-input" name="language" component="select">
              <option></option>
              {languages.map(language => {
                return (
                  <option
                    key={language.code}
                    name="language"
                    value={language.code}
                  >
                    {language.name}
                  </option>
                );
              })}
            </Field>
            <AlertErrorMessage name="language" type="error" />
          </FormItem>
          <FormItem>
            <Field className="ant-input" name="project_id" component="select">
              <option></option>
              {projects.map(project => {
                return (
                  <option key={project.id} name="project_id" value={project.id}>
                    {project.name}
                  </option>
                );
              })}
            </Field>
            <AlertErrorMessage name="project_id" type="error" />
          </FormItem>
          <FormItem>
            <label>
              <Field
                name="published"
                type="checkbox"
                checked={values.published}
              />
              <span> Published</span>
            </label>
          </FormItem>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default InstrumentForm;
