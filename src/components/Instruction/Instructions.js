import React, { useState, useContext } from "react";
import {
  createInstruction,
  deleteInstruction,
  updateInstruction
} from "../../utils/api/instruction";
import { CellActions, EditableProvider } from "../utils/EditableCell";
import Translations from "../InstructionTranslation/Translations";
import { InstructionContext } from "../../context/InstructionContext";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import ErrorAlert from "../utils/Errors";
import { Form } from "antd";

const EditableTable = props => {
  const [form] = Form.useForm();
  const newId = "new";
  const [instructions, setInstructions] = useState(props.instructions);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [errors, setErrors] = useState(null);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "25%",
      editable: true,
      ...getColumnSearchProps("title", searchText, setSearchText)
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "55%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
          render: (text, instruction) => (
            <span
              dangerouslySetInnerHTML={{
                __html: instruction.text
              }}
            />
          )
        }
      : {
          title: "Text",
          dataIndex: "text",
          width: "55%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText)
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
          handleTranslations={handleShowInstructionTranslations}
        />
      )
    }
  ];

  const isEditing = record => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (form, record) => {
    try {
      const row = await form.validateFields();
      const newData = [...instructions];
      const index = newData.findIndex(item => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          createInstruction(row)
            .then(result => {
              newData.splice(index, 1, {
                ...item,
                ...result.data
              });
              setEditingKey("");
              setInstructions(newData);
            })
            .catch(error => {
              setErrors(error.data.errors.join("; "));
            });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateInstruction(record.id, row)
            .then(result => {
              setEditingKey("");
              setInstructions(newData);
            })
            .catch(error => {
              setErrors(error.data.errors.join("; "));
            });
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setInstructions(newData);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const edit = key => {
    setEditingKey(key);
  };

  const handleAdd = () => {
    setEditingKey(newId);
    setInstructions([{ id: newId, title: "", text: "" }, ...instructions]);
  };

  const handleDelete = record => {
    if (record.id === newId) {
      setInstructions([...instructions].filter(item => item.id !== record.id));
    } else {
      deleteInstruction(record.id).then(res => {
        setInstructions(
          [...instructions].filter(item => item.id !== record.id)
        );
      });
    }
  };

  const handleShowInstructionTranslations = record => {
    props.setInstructionsToTranslate([record]);
    props.setShowTranslations(!props.showTranslations);
  };

  const handleShowAllTranslations = () => {
    props.setInstructionsToTranslate(instructions);
    props.setShowTranslations(!props.showTranslations);
  };

  if (errors != null) {
    return <ErrorAlert errors={errors} setErrors={setErrors} />;
  } else {
    return (
      <EditableProvider
        form={form}
        columns={columns}
        data={instructions}
        isEditing={isEditing}
        handleShowAllTranslations={handleShowAllTranslations}
        handleAdd={handleAdd}
        cancel={cancel}
      />
    );
  }
};

const Instructions = () => {
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  const [showTranslations, setShowTranslations] = useState(false);
  const [instructionsToTranslate, setInstructionsToTranslate] = useState([]);

  if (showTranslations) {
    return (
      <Translations
        instructions={instructionsToTranslate}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else {
    return (
      <EditableTable
        instructions={instructions}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
        setInstructionsToTranslate={setInstructionsToTranslate}
      />
    );
  }
};

export default Instructions;
