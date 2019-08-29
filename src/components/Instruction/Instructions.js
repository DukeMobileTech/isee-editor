import React, { useState, useEffect } from "react";
import {
  Table,
  Spin,
  Form,
  Input,
  Button,
  Popconfirm,
  Divider,
  Icon
} from "antd";
import {
  getInstructions,
  updateInstruction,
  createInstruction,
  deleteInstruction
} from "../../utils/API";
import { RightAddButton } from "../../utils/Utils";

const EditableContext = React.createContext();

const EditableTable = props => {
  const newId = "new";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "25%",
      editable: true
    },
    {
      title: "Text",
      dataIndex: "text",
      width: "55%",
      editable: true,
      render: (text, instruction) => (
        <span
          dangerouslySetInnerHTML={{
            __html: instruction.text
          }}
        />
      )
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

  useEffect(() => {
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstructions = async () => {
    const results = await getInstructions();
    setLoading(false);
    setData(results.data);
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
          updateInstruction(record.id, record).then(result => {
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
    <Spin spinning={loading}>
      <EditableContext.Provider value={props.form}>
        <RightAddButton handleClick={handleAdd} /> <br />
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
    </Spin>
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

const Instructions = () => {
  const EditableFormTable = Form.create()(EditableTable);
  return <EditableFormTable />;
};

export default Instructions;
