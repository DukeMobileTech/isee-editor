import { Form } from "antd";
import React, { useContext, useState } from "react";
import { OptionContext } from "../../context/OptionContext";
import {
  createOption,
  deleteOption,
  updateOption,
} from "../../utils/api/option";
import Translations from "../OptionTranslation/Translations";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import { CellActions, EditableProvider } from "../utils/EditableCell";
import ErrorAlert from "../utils/Errors";

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const newId = "new";
  const [options, setOptions] = useContext(OptionContext);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [errors, setErrors] = useState(null);

  const isEditing = (record) => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (form, record) => {
    try {
      const row = await form.validateFields();
      const newData = [...options];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          createOption(row)
            .then((result) => {
              newData.splice(index, 1, {
                ...item,
                ...result.data,
              });
              setEditingKey("");
              setOptions(newData);
            })
            .catch((error) => {
              setErrors(error.data.errors.join("; "));
            });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          updateOption(record.id, row)
            .then((result) => {
              setEditingKey("");
              setOptions(newData);
            })
            .catch((error) => {
              setErrors(error.data.errors.join("; "));
            });
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setOptions(newData);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const handleAdd = () => {
    setEditingKey(newId);
    setOptions([{ id: newId, title: "", text: "" }, ...options]);
  };

  const handleDelete = (record) => {
    if (record.id === newId) {
      setOptions([...options].filter((item) => item.id !== record.id));
    } else {
      deleteOption(record.id).then((res) => {
        setOptions([...options].filter((item) => item.id !== record.id));
      });
    }
  };

  const handleShowOptionTranslations = (record) => {
    props.setOptionsToTranslate([record]);
    props.setShowTranslations(!props.showTranslations);
  };

  const handleShowAllTranslations = () => {
    props.setOptionsToTranslate(options);
    props.setShowTranslations(!props.showTranslations);
  };

  const columns = [
    {
      title: "Identifier",
      dataIndex: "identifier",
      width: "25%",
      editable: true,
      ...getColumnSearchProps("identifier", searchText, setSearchText),
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "55%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
          render: (text, option) => (
            <span
              dangerouslySetInnerHTML={{
                __html: option.text,
              }}
            />
          ),
        }
      : {
          title: "Text",
          dataIndex: "text",
          width: "55%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
        },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <CellActions
          record={record}
          editingKey={editingKey}
          isEditing={isEditing}
          save={save}
          cancel={cancel}
          edit={edit}
          handleDelete={handleDelete}
          handleTranslations={handleShowOptionTranslations}
        />
      ),
    },
  ];

  if (errors != null) {
    return <ErrorAlert errors={errors} setErrors={setErrors} />;
  } else {
    return (
      <EditableProvider
        form={form}
        columns={columns}
        data={options}
        isEditing={isEditing}
        handleShowAllTranslations={handleShowAllTranslations}
        handleAdd={handleAdd}
        cancel={cancel}
      />
    );
  }
};

const Options = () => {
  const [showTranslations, setShowTranslations] = useState(false);
  const [optionsToTranslate, setOptionsToTranslate] = useState([]);

  if (showTranslations) {
    return (
      <Translations
        options={optionsToTranslate}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else {
    return (
      <EditableTable
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
        setOptionsToTranslate={setOptionsToTranslate}
      />
    );
  }
};

export default Options;
