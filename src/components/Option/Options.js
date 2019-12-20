import { Button, Divider, Form, Icon, Input, Popconfirm, Table } from "antd";
import React, { useState, useContext } from "react";
import {
  createOption,
  deleteOption,
  updateOption
} from "../../utils/api/option";

import { TranslationAddButtons, TranslationButton } from "../../utils/Buttons";
import Highlighter from "react-highlight-words";
import Translations from "../OptionTranslation/Translations";
import { OptionContext } from "../../context/OptionContext";

const EditableContext = React.createContext();

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
    {
      title: "Text",
      dataIndex: "text",
      width: "55%",
      editable: true,
      ...getColumnSearchProps("text")
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <Button
                  type="primary"
                  onClick={() => save(form, record)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => cancel(record.id)}
            >
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              type="primary"
              disabled={editingKey !== ""}
              onClick={() => edit(record.id)}
            >
              <Icon type="edit" />
            </Button>
            <Divider type="vertical" />
            <TranslationButton
              handleClick={() => handleShowOptionTranslations(record)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title={`Sure to delete ${record.title}?`}
              onConfirm={() => handleDelete(record)}
            >
              <Button type="danger">
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </span>
        );
      }
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

  const components = {
    body: {
      cell: EditableCell
    }
  };

  const tableColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

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
    <EditableContext.Provider value={props.form}>
      <TranslationAddButtons
        handleTranslationClick={handleShowAllTranslations}
        handleAddClick={handleAdd}
      />
      <Table
        components={components}
        bordered
        dataSource={options}
        rowKey={option => option.id}
        columns={tableColumns}
        pagination={{
          onChange: cancel,
          defaultPageSize: 25
        }}
      />
    </EditableContext.Provider>
  );
};

const EditableCell = props => {
  const renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      index,
      children,
      ...restProps
    } = props;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(<Input.TextArea />)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
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
