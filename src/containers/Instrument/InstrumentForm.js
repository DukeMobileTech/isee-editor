import { Form as AntForm } from "antd";
import { Field, Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  createInstrument,
  updateInstrument,
} from "../../redux/actions/instruments";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { languages } from "../../utils/Constants";
import { CenteredH4 } from "../../utils/Styles";
import { AlertErrorMessage } from "../../utils/Utils";

const FormItem = AntForm.Item;

const InstrumentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  language: Yup.string().required("Language is required"),
  project_id: Yup.string().required("Project is required"),
});

const InstrumentForm = ({
  projects,
  createInstrument,
  updateInstrument,
  handleCancel,
  instrument,
  projectId,
}) => {
  return (
    <Formik
      initialValues={{
        id: (instrument && instrument.id) || null,
        title: (instrument && instrument.title) || "",
        project_id: (instrument && instrument.project_id) || "",
        language: (instrument && instrument.language) || "",
        published: (instrument && instrument.published) || false,
      }}
      validationSchema={InstrumentSchema}
      onSubmit={(values, { setErrors }) => {
        const instrumentObj = {
          title: values.title,
          project_id: values.project_id,
          language: values.language,
          published: values.published,
        };
        if (values.id) {
          updateInstrument(projectId, values.id, instrumentObj);
          handleCancel();
        } else {
          createInstrument(values.project_id, instrumentObj);
          handleCancel();
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
            <Field
              className="ant-input"
              name="language"
              placeholder="Select language"
              component="select"
            >
              <option />
              {languages.map((language) => {
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
            <Field
              className="ant-input"
              name="project_id"
              placeholder="Select project"
              component="select"
            >
              <option />
              {projects.map((project) => {
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
          <LeftCancelButton handleClick={handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

function mapStateToProps(state, ownProps) {
  const { projects, createInstrument, updateInstrument } = state;
  const instrument = ownProps.instrument;
  const handleCancel = ownProps.handleCancel;
  const projectId = ownProps.projectId;
  return {
    projects,
    createInstrument,
    updateInstrument,
    handleCancel,
    instrument,
    projectId,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createInstrument: (projectId, instrument) =>
      dispatch(createInstrument(projectId, instrument)),
    updateInstrument: (projectId, id, instrument) =>
      dispatch(updateInstrument(projectId, id, instrument)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstrumentForm);
