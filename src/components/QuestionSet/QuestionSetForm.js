import * as Yup from "yup";

import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";
import { Field, Form, Formik } from "formik";
import {
  createQuestionSet,
  updateQuestionSet
} from "../../utils/api/question_set";

import { Form as AntForm, Modal } from "antd";
import React from "react";
import { modalWidth } from "../../utils/Constants";

const FormItem = AntForm.Item;

const QuestionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const QuestionSetForm = props => {
  const questionSet = props.questionSet;
  const title = questionSet
    ? `Editing ${questionSet.title}`
    : "New Question Set";

  return (
    <Modal
      title={title}
      visible={true}
      footer={null}
      destroyOnClose={true}
      onCancel={props.handleCancel}
      width={modalWidth}
    >
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
    </Modal>
  );
};

export default QuestionSetForm;
