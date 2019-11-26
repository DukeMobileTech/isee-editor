import * as Yup from "yup";

import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";
import { Field, Form, Formik } from "formik";
import {
  createScoreScheme,
  updateScoreScheme
} from "../../utils/api/score_scheme";

import { Form as AntForm } from "antd";
import { CenteredH4 } from "../../utils/Styles";
import React from "react";

const FormItem = AntForm.Item;

const ScoreSchemeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const ScoreSchemeForm = props => {
  const instrument = props.instrument;
  const scoreScheme = props.scoreScheme;

  return (
    <Formik
      initialValues={{
        id: (scoreScheme && scoreScheme.id) || null,
        title: (scoreScheme && scoreScheme.title) || "",
        active: (scoreScheme && scoreScheme.active) || false
      }}
      validationSchema={ScoreSchemeSchema}
      onSubmit={(values, { setErrors }) => {
        const scoreScheme = {
          title: values.title,
          active: values.active
        };
        if (values.id) {
          updateScoreScheme(
            instrument.project_id,
            instrument.id,
            values.id,
            scoreScheme
          )
            .then(response => {
              if (response.status === 204) {
                props.fetchScoreSchemes();
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createScoreScheme(instrument.project_id, instrument.id, scoreScheme)
            .then(response => {
              if (response.status === 201) {
                props.fetchScoreSchemes();
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
            {values.title ? values.title : "New Score Scheme"}
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
            <label>
              <Field name="active" type="checkbox" checked={values.active} />
              <span> Active</span>
            </label>
          </FormItem>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default ScoreSchemeForm;
