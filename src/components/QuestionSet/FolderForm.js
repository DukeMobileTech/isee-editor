import { Form as AntForm, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { createFolder, updateFolder } from "../../utils/api/folder";
import { LeftCancelButton, RightSubmitButton } from "../../utils/Buttons";
import { modalWidth } from "../../utils/Constants";
import { AlertErrorMessage } from "../../utils/Utils";

const FormItem = AntForm.Item;

const FolderSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

const FolderForm = (props) => {
  const questionSet = props.questionSet;
  const folder = props.folder;
  const title = folder ? `Editing ${folder.title}` : "New Folder";

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
          id: (folder && folder.id) || null,
          title: (folder && folder.title) || "",
          question_set_id: questionSet.id,
        }}
        validationSchema={FolderSchema}
        onSubmit={(values, { setErrors }) => {
          const folder = {
            title: values.title,
            question_set_id: values.question_set_id,
          };
          if (values.id) {
            updateFolder(questionSet.id, values.id, folder)
              .then((response) => {
                if (response.status === 204) {
                  props.fetchFolders();
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
            createFolder(questionSet.id, folder)
              .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                  props.fetchFolders();
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
    </Modal>
  );
};

export default FolderForm;
