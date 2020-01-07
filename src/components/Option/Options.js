import { Button, Form, Icon, Input } from "antd";
import React, { useState, useContext } from "react";
import {
  createOption,
  deleteOption,
  updateOption
} from "../../utils/api/option";

import Highlighter from "react-highlight-words";
import Translations from "../OptionTranslation/Translations";
import { OptionContext } from "../../context/OptionContext";
import { CellActions, EditableProvider } from "../utils/EditableCell";

const EditableTable = props => {
  const newId = "new";
  const [options, setOptions] = useState(props.options);
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
      title: "Identifier",
      dataIndex: "identifier",
      width: "25%",
      editable: true,
      ...getColumnSearchProps("identifier")
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "55%",
          editable: true,
          ...getColumnSearchProps("text"),
          render: (text, option) => (
            <span
              dangerouslySetInnerHTML={{
                __html: option.text
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
          handleTranslations={handleShowOptionTranslations}
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
      const newData = [...options];
      const index = newData.findIndex(item => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          createOption(row).then(result => {
            newData.splice(index, 1, {
              ...item,
              ...result.data
            });
            setEditingKey("");
            setOptions(newData);
          });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateOption(record.id, row).then(result => {
            setEditingKey("");
            setOptions(newData);
          });
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setOptions(newData);
      }
    });
  };

  const edit = key => {
    setEditingKey(key);
  };

  const handleAdd = () => {
    setEditingKey(newId);
    setOptions([{ id: newId, title: "", text: "" }, ...options]);
  };

  const handleDelete = record => {
    deleteOption(record.id).then(res => {
      const dataSource = [...options];
      setOptions(dataSource.filter(item => item.id !== record.id));
    });
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const handleShowOptionTranslations = record => {
    props.setOptionsToTranslate([record]);
    props.setShowTranslations(!props.showTranslations);
  };

  const handleShowAllTranslations = () => {
    props.setOptionsToTranslate(options);
    props.setShowTranslations(!props.showTranslations);
  };

  return (
    <EditableProvider
      form={props.form}
      columns={columns}
      data={options}
      isEditing={isEditing}
      handleShowAllTranslations={handleShowAllTranslations}
      handleAdd={handleAdd}
      cancel={cancel}
    />
  );
};

const Options = () => {
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useContext(OptionContext);
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
    const EditableFormTable = Form.create()(EditableTable);
    return (
      <EditableFormTable
        options={options}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
        setOptionsToTranslate={setOptionsToTranslate}
      />
    );
  }
};

export default Options;
