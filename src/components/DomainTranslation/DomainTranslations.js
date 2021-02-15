import { Form } from "antd";
import React, { useState } from "react";
import {
  CellActions,
  EditableTranslationsProvider
} from "../utils/EditableCell";
import {
  createDomainTranslation,
  updateDomainTranslation,
  deleteDomainTranslation
} from "../../utils/api/domain_translation";

const EditableTable = props => {
  const language = props.language;
  const domain = props.domain;
  const projectId = props.projectId;
  const scoreScheme = props.scoreScheme;
  const [translations, setTranslations] = useState(props.translations);
  const [editingKey, setEditingKey] = useState("");
  const newId = "new";
  const columns = [
    {
      title: "Text",
      dataIndex: "text",
      width: "70%",
      editable: true,
      render: (text, translation) => (
        <span
          dangerouslySetInnerHTML={{
            __html: translation.text
          }}
        />
      )
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
      )
    }
  ];

  const isEditing = record => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  const save = (form, record) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...translations];
      const index = newData.findIndex(item => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          row.domain_id = domain.id;
          row.language = language;
          createDomainTranslation(projectId, scoreScheme, row).then(result => {
            newData.splice(index, 1, {
              ...item,
              ...result.data
            });
            setEditingKey("");
            setTranslations(newData);
          });
        } else {
          row.id = record.id;
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateDomainTranslation(projectId, scoreScheme, row).then(result => {
            setEditingKey("");
            setTranslations(newData);
          });
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setTranslations(newData);
      }
    });
  };

  const edit = key => {
    setEditingKey(key);
  };

  const handleAdd = () => {
    setEditingKey(newId);
    setTranslations([{ id: newId, text: "" }, ...translations]);
  };

  const handleDelete = record => {
    if (record.id === newId) {
      translations.splice(translations.indexOf(record), 1);
      setTranslations([...translations]);
    } else {
      deleteDomainTranslation(projectId, scoreScheme, record).then(res => {
        const dataSource = [...translations];
        setTranslations(dataSource.filter(item => item.id !== record.id));
      });
    }
  };

  return (
    <EditableTranslationsProvider
      form={props.form}
      columns={columns}
      language={language}
      translations={translations}
      isEditing={isEditing}
      handleAdd={handleAdd}
    />
  );
};

const DomainTranslations = props => {
  const EditableFormTable = Form.create()(EditableTable);
  return (
    <EditableFormTable
      domain={props.domain}
      projectId={props.projectId}
      scoreScheme={props.scoreScheme}
      translations={props.translations}
      language={props.language}
    />
  );
};

export default DomainTranslations;
