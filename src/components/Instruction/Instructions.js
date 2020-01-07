import { Button, Form, Icon, Input } from "antd";
import React, { useState, useContext } from "react";
import {
  createInstruction,
  deleteInstruction,
  updateInstruction
} from "../../utils/api/instruction";
import Highlighter from "react-highlight-words";
import { CellActions, EditableProvider } from "../utils/EditableCell";
import Translations from "../InstructionTranslation/Translations";
import { InstructionContext } from "../../context/InstructionContext";

const EditableTable = props => {
  const newId = "new";
  const [instructions, setInstructions] = useState(props.instructions);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "25%",
      editable: true,
      ...getColumnSearchProps("title")
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "55%",
          editable: true,
          ...getColumnSearchProps("text"),
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
          ...getColumnSearchProps("text")
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

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const isEditing = record => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  const save = (form, record) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...instructions];
      const index = newData.findIndex(item => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          createInstruction(row).then(result => {
            newData.splice(index, 1, {
              ...item,
              ...result.data
            });
            setEditingKey("");
            setInstructions(newData);
          });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateInstruction(record.id, row).then(result => {
            setEditingKey("");
            setInstructions(newData);
          });
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setInstructions(newData);
      }
    });
  };

  const edit = key => {
    setEditingKey(key);
  };

  const handleAdd = () => {
    setEditingKey(newId);
    setInstructions([{ id: newId, title: "", text: "" }, ...instructions]);
  };

  const handleDelete = record => {
    deleteInstruction(record.id).then(res => {
      const dataSource = [...instructions];
      setInstructions(dataSource.filter(item => item.id !== record.id));
    });
  };

  const handleShowInstructionTranslations = record => {
    props.setInstructionsToTranslate([record]);
    props.setShowTranslations(!props.showTranslations);
  };

  const handleShowAllTranslations = () => {
    props.setInstructionsToTranslate(instructions);
    props.setShowTranslations(!props.showTranslations);
  };

  return (
    <EditableProvider
      form={props.form}
      columns={columns}
      data={instructions}
      isEditing={isEditing}
      handleShowAllTranslations={handleShowAllTranslations}
      handleAdd={handleAdd}
      cancel={cancel}
    />
  );
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
    const EditableFormTable = Form.create()(EditableTable);
    return (
      <EditableFormTable
        instructions={instructions}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
        setInstructionsToTranslate={setInstructionsToTranslate}
      />
    );
  }
};

export default Instructions;
