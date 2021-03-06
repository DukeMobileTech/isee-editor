import { Form } from "antd";
import React, { useState } from "react";
import {
  createQuestionTranslation,
  deleteQuestionTranslation,
  updateQuestionTranslation,
} from "../../utils/api/question_translation";
import {
  CellActions,
  EditableTranslationsProvider,
} from "../utils/EditableCell";

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const language = props.language;
  const question = props.question;
  const [translations, setTranslations] = useState(props.translations);
  const [editingKey, setEditingKey] = useState("");
  const newId = "new";

  const isEditing = (record) => record.id === editingKey;

  const cancel = () => {
    props.fetchQuestions();
  };

  const save = async (form, record) => {
    try {
      const row = await form.validateFields();
      const newData = [...translations];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          row.question_id = question.id;
          row.language = language;
          createQuestionTranslation(row).then((result) => {
            props.fetchQuestions();
          });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          updateQuestionTranslation(record.id, row).then((result) => {
            props.fetchQuestions();
          });
        }
      } else {
        props.fetchQuestions();
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const edit = (key) => {
    setEditingKey(key);
  };

  const handleAdd = () => {
    setEditingKey(newId);
    setTranslations([{ id: newId, text: "" }, ...translations]);
  };

  const handleDelete = (record) => {
    if (record.id === newId) {
      props.fetchQuestions();
    } else {
      deleteQuestionTranslation(record.id).then((res) => {
        props.fetchQuestions();
      });
    }
  };

  const columns = [
    {
      title: "Text",
      dataIndex: "text",
      width: "70%",
      editable: true,
      render: (text, translation) => (
        <span
          dangerouslySetInnerHTML={{
            __html: translation.text,
          }}
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <CellActions
          record={record}
          editingKey={editingKey}
          isEditing={isEditing}
          save={save}
          cancel={cancel}
          edit={edit}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <EditableTranslationsProvider
      form={form}
      columns={columns}
      language={language}
      translations={translations}
      isEditing={isEditing}
      handleAdd={handleAdd}
    />
  );
};

const QuestionTranslations = (props) => {
  return (
    <EditableTable
      question={props.question}
      translations={props.translations}
      language={props.language}
      fetchQuestions={props.fetchQuestions}
    />
  );
};

export default QuestionTranslations;
