import { Form as AntForm, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import {
  createQuestionSet,
  updateQuestionSet,
} from "../../utils/api/question_set";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { modalWidth } from "../../utils/Constants";
import { AlertErrorMessage } from "../../utils/Utils";

const FormItem = AntForm.Item;

const QuestionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

const QuestionSetForm = (props) => {
  const questionSet = props.questionSet;
  const title = questionSet
    ? `Editing ${questionSet.title}`
    : "New Question Set";

  return (
    <Modal
      title={title}
      visible
      footer={null}
      destroyOnClose
      onCancel={props.handleCancel}
      width={modalWidth}
    >
      <Formik
        initialValues={{
          id: (questionSet && questionSet.id) || null,
          title: (questionSet && questionSet.title) || "",
        }}
        validationSchema={QuestionSetSchema}
        onSubmit={(values, { setErrors }) => {
          const questionSet = {
            title: values.title,
          };
          if (values.id) {
            updateQuestionSet(values.id, questionSet)
              .then((response) => {
                if (response.status === 204) {
                  props.fetchQuestionSets();
                }
              })
              .catch((error) => {
                for (const err of error.data.errors) {
                  if (err.includes("Title")) {
                    setErrors({ title: err });
                  }
                }
              });
          } else {
            createQuestionSet(questionSet)
              .then((response) => {
                if (response.status === 201) {
                  props.fetchQuestionSets();
                }
              })
              .catch((error) => {
                for (const err of error.data.errors) {
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
