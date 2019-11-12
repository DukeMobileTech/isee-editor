import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm } from "antd";
import * as Yup from "yup";
import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Utils";
import { updateFolder, createFolder } from "../../utils/API";
import { CenteredH3 } from "../../utils/Styles";

const FormItem = AntForm.Item;

const FolderSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const FolderForm = props => {
  const questionSet = props.questionSet;
  const folder = props.folder;
  const title = folder ? `Editing ${folder.title}` : "New Folder";

  return (
    <Formik
      initialValues={{
        id: (folder && folder.id) || null,
        title: (folder && folder.title) || "",
        question_set_id: questionSet.id
      }}
      validationSchema={FolderSchema}
      onSubmit={(values, { setErrors }) => {
        const folder = {
          title: values.title,
          question_set_id: values.question_set_id
        };
        if (values.id) {
          updateFolder(questionSet.id, values.id, folder)
            .then(response => {
              if (response.status === 204) {
                props.fetchFolders();
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
          createFolder(questionSet.id, folder)
            .then(response => {
              if (response.status === 201) {
                props.fetchFolders();
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
          <CenteredH3>{title}</CenteredH3>
          <FormItem>
            <Field
              className="ant-input"
              name="title"
              placeholder="Enter folder title"
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

export default FolderForm;
