import {
  Button,
  Divider,
  Form,
  Icon,
  Input,
  Popconfirm,
  Spin,
  Table
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createOption,
  deleteOption,
  getOptions,
  updateOption
} from "../../utils/api/option";

import { FolderAddButton } from "../../utils/Utils";
import Highlighter from "react-highlight-words";
import Translations from "./Translations";

const EditableContext = React.createContext();

const EditableTable = props => {
  const newId = "new";
  const [data, setData] = useState(props.options);
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
      const newData = [...data];
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
            setData(newData);
          });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateOption(record.id, row).then(result => {
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
    deleteOption(record.id).then(res => {
      const dataSource = [...data];
      setData(dataSource.filter(item => item.id !== record.id));
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

  return (
    <EditableContext.Provider value={props.form}>
      <FolderAddButton handleClick={handleAdd} /> <br />
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
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOptions = async () => {
    const results = await getOptions();
    setLoading(false);
    setOptions(results.data);
  };

  const OptionsTable = () => {
    const EditableFormTable = Form.create()(EditableTable);
    return <EditableFormTable options={options} />;
  };

  const View = () => {
    if (showTranslations) {
      return (
        <Translations
          options={options}
          setShowTranslations={setShowTranslations}
          showTranslations={showTranslations}
        />
      );
    } else {
      return <OptionsTable />;
    }
  };

  const TButton = () => {
    if (showTranslations) {
      return null;
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

  return (
    <Spin spinning={loading}>
      <TButton />
      <View />
    </Spin>
  );
};

export default Options;
