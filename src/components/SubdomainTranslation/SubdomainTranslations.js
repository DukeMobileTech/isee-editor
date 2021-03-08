import { Form } from "antd";
import React, { useState } from "react";
import {
  createSubdomainTranslation,
  deleteSubdomainTranslation,
  updateSubdomainTranslation,
} from "../../utils/api/subdomain_translation";
import {
  CellActions,
  EditableTranslationsProvider,
} from "../utils/EditableCell";

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const language = props.language;
  const subdomain = props.subdomain;
  const instrumentId = props.instrumentId;
  const projectId = props.projectId;
  const domain = props.domain;
  const [translations, setTranslations] = useState(props.translations);
  const [editingKey, setEditingKey] = useState("");
  const newId = "new";

  const isEditing = (record) => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (form, record) => {
    try {
      const row = await form.validateFields();
      const newData = [...translations];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          row.subdomain_id = subdomain.id;
          row.language = language;
          createSubdomainTranslation(projectId, instrumentId, domain, row).then(
            (result) => {
              newData.splice(index, 1, {
                ...item,
                ...result.data,
              });
              setEditingKey("");
              setTranslations(newData);
            }
          );
        } else {
          row.id = record.id;
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          updateSubdomainTranslation(projectId, instrumentId, domain, row).then(
            (result) => {
              setEditingKey("");
              setTranslations(newData);
            }
          );
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setTranslations(newData);
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
      translations.splice(translations.indexOf(record), 1);
      setTranslations([...translations]);
    } else {
      deleteSubdomainTranslation(projectId, instrumentId, domain, record).then(
        (res) => {
          const dataSource = [...translations];
          setTranslations(dataSource.filter((item) => item.id !== record.id));
        }
      );
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

const SubdomainTranslations = (props) => {
  return (
    <EditableTable
      subdomain={props.subdomain}
      projectId={props.projectId}
      instrumentId={props.instrumentId}
      translations={props.translations}
      language={props.language}
      domain={props.domain}
    />
  );
};

export default SubdomainTranslations;
