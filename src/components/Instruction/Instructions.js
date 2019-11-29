import {
  Button,
  Divider,
  Form,
  Icon,
  Input,
  Popconfirm,
  Spin,
  Table,
  Row
} from "antd";
import React, { useEffect, useState, Fragment } from "react";
import {
  createInstruction,
  deleteInstruction,
  getInstructions,
  updateInstruction
} from "../../utils/api/instruction";
import Highlighter from "react-highlight-words";

import { FolderAddButton } from "../../utils/Utils";
import ReactQuill from "react-quill";
import Translations from "./Translations";

const EditableContext = React.createContext();

const EditableTable = props => {
  const newId = "new";
  const [data, setData] = useState(props.instructions);
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
      const newData = [...data];
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
            setData(newData);
          });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateInstruction(record.id, row).then(result => {
            setEditingKey("");
            setData(newData);
          });
        }
      } else {
        newData.push(row);
        setEditingKey("");
        setData(newData);
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
    setData([{ id: newId, title: "", text: "" }, ...data]);
  };

  const handleDelete = record => {
    deleteInstruction(record.id).then(res => {
      const dataSource = [...data];
      setData(dataSource.filter(item => item.id !== record.id));
    });
  };

  return (
    <EditableContext.Provider value={props.form}>
      <Row style={{ marginBottom: "2px" }}>
        <FolderAddButton handleClick={handleAdd} />
      </Row>
      <Table
        components={components}
        bordered
        dataSource={data}
        rowKey={instruction => instruction.id}
        columns={tableColumns}
        pagination={{
          onChange: cancel
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
          dataIndex === "title" ? (
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
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ],
                initialValue: record[dataIndex]
              })(<ReactQuill value={record[dataIndex]} />)}
            </Form.Item>
          )
        ) : (
          children
        )}
      </td>
    );
  };

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};

const Instructions = () => {
  const [loading, setLoading] = useState(true);
  const [instructions, setInstructions] = useState([]);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstructions = async () => {
    const results = await getInstructions();
    setLoading(false);
    setInstructions(results.data);
  };

  const TranslationButton = () => {
    if (showTranslations) {
      return <Fragment />;
    } else {
      return (
        <Button
          type="primary"
          onClick={() => setShowTranslations(!showTranslations)}
        >
          <Icon type="global" />
        </Button>
      );
    }
  };

  if (showTranslations) {
    return (
      <Translations
        instructions={instructions}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else {
    const EditableFormTable = Form.create()(EditableTable);
    return (
      <Spin spinning={loading}>
        <TranslationButton />
        <EditableFormTable instructions={instructions} />
      </Spin>
    );
  }
};

export default Instructions;
