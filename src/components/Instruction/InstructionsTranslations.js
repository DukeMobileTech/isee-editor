import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Icon,
  Input,
  Popconfirm,
  Row,
  Table
} from "antd";
import React, { useState } from "react";
import {
  createInstructionTranslation,
  updateInstructionTranslation,
  deleteInstructionTranslation
} from "../../utils/api/instruction_translation";
import ReactQuill from "react-quill";

const EditableContext = React.createContext();

const EditableTable = props => {
  const language = props.language;
  const instruction = props.instruction;
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
              title={`Sure to delete ${record.text}?`}
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
      const newData = [...translations];
      const index = newData.findIndex(item => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        if (record.id === newId) {
          row.instruction_id = instruction.id;
          row.language = language;
          createInstructionTranslation(row).then(result => {
            newData.splice(index, 1, {
              ...item,
              ...result.data
            });
            setEditingKey("");
            setTranslations(newData);
          });
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          });
          updateInstructionTranslation(record.id, row).then(result => {
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
    setTranslations([{ id: newId, text: "" }, ...translations]);
  };

  const handleDelete = record => {
    if (record.id === newId) {
      translations.splice(translations.indexOf(record), 1);
      setTranslations([...translations]);
    } else {
      deleteInstructionTranslation(record.id).then(res => {
        const dataSource = [...translations];
        setTranslations(dataSource.filter(item => item.id !== record.id));
      });
    }
  };

  const customizeRenderEmpty = () => {
    if (language) {
      return (
        <p style={{ textAlign: "center" }}>No translations for language</p>
      );
    } else {
      return <p style={{ textAlign: "center" }}>Select Translation Language</p>;
    }
  };

  return (
    <EditableContext.Provider value={props.form}>
      <Row gutter={8} type="flex" justify="space-around" align="middle">
        <Col span={22}>
          <ConfigProvider renderEmpty={true && customizeRenderEmpty}>
            <Table
              components={components}
              bordered
              dataSource={translations}
              rowKey={translation => translation.id}
              columns={tableColumns}
              pagination={false}
              size="small"
            />
          </ConfigProvider>
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={handleAdd}>
            <Icon type="plus" />
          </Button>
        </Col>
      </Row>
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

const InstructionTranslations = props => {
  const EditableFormTable = Form.create()(EditableTable);
  return (
    <EditableFormTable
      instruction={props.instruction}
      translations={props.translations}
      language={props.language}
    />
  );
};

export default InstructionTranslations;
