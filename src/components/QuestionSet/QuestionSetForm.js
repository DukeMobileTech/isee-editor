import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm } from "antd";
import * as Yup from "yup";
import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";
import { updateQuestionSet, createQuestionSet } from "../../utils/API";

const FormItem = AntForm.Item;

const QuestionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const QuestionSetForm = props => {
  const questionSet = props.questionSet;

  return (
    <Formik
      initialValues={{
        id: (questionSet && questionSet.id) || null,
        title: (questionSet && questionSet.title) || ""
      }}
      validationSchema={QuestionSetSchema}
      onSubmit={(values, { setErrors }) => {
        const questionSet = {
          title: values.title
        };
        if (values.id) {
          updateQuestionSet(values.id, questionSet)
            .then(response => {
              if (response.status === 204) {
                props.fetchQuestionSets();
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
          createQuestionSet(questionSet)
            .then(response => {
              if (response.status === 201) {
                props.fetchQuestionSets();
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
        <Form>
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

export default QuestionSetForm;
