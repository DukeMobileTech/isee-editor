import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
} from "antd";
import React, { Fragment } from "react";
import ReactQuill from "react-quill";
import { TranslationAddButtons, TranslationButton } from "../../utils/Buttons";

export const EditableContext = React.createContext(null);

const editView = (dataIndex, title, record) =>
  dataIndex === "text" ? (
    <Form.Item
      name={dataIndex}
      style={{
        margin: 0,
      }}
      rules={[
        {
          required: true,
          message: `Please Input ${title}!`,
        },
      ]}
    >
      <ReactQuill value={record[dataIndex]} />
    </Form.Item>
  ) : (
    <Form.Item
      name={dataIndex}
      style={{
        margin: 0,
      }}
      rules={[
        {
          required: title === "identifier",
          message: `Please Input ${title}!`,
        },
      ]}
    >
      <Input value={record[dataIndex]} />
    </Form.Item>
  );

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? editView(dataIndex, title, record) : children}
    </td>
  );
};

export const CellActions = ({
  record,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  handleTranslations,
}) => {
  const editable = isEditing(record);

  return editable ? (
    <span>
      <EditableContext.Consumer>
        {(form) => (
          <Button
            type="primary"
            title="Save"
            onClick={() => {
              save(form, record);
            }}
            style={{ margin: 2 }}
          >
            <SaveOutlined />
          </Button>
        )}
      </EditableContext.Consumer>
      <Divider type="vertical" />
      <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record.id)}>
        <Button title="Cancel" style={{ margin: 2 }}>
          <UndoOutlined />
        </Button>
      </Popconfirm>
    </span>
  ) : (
    <span>
      <Button
        type="primary"
        title="Edit"
        disabled={editingKey !== ""}
        onClick={() => edit(record)}
        style={{ margin: 2 }}
      >
        <EditOutlined />
      </Button>
      {handleTranslations && (
        <Fragment>
          <Divider type="vertical" />
          <TranslationButton handleClick={() => handleTranslations(record)} />
        </Fragment>
      )}
      <Divider type="vertical" />
      <Popconfirm
        title={`Sure to delete ${record.text}?`}
        onConfirm={() => handleDelete(record)}
      >
        <Button type="danger" title="Delete" style={{ margin: 2 }}>
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </span>
  );
};

export const EditableTranslationsProvider = ({
  form,
  language,
  columns,
  translations,
  isEditing,
  handleAdd,
}) => {
  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const tableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const customizeRenderEmpty = (language) => {
    if (language) {
      return (
        <p style={{ textAlign: "center" }}>No translations for language</p>
      );
    } else {
      return <p style={{ textAlign: "center" }}>Select Translation Language</p>;
    }
  };

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <Row gutter={8} type="flex" justify="space-between" align="middle">
          <Col span={21}>
            <ConfigProvider renderEmpty={true && customizeRenderEmpty}>
              <Table
                components={components}
                bordered
                dataSource={translations}
                rowKey={(translation) => translation.id}
                columns={tableColumns}
                pagination={false}
                size="small"
              />
            </ConfigProvider>
          </Col>
          <Col span={3}>
            {language && (
              <Button
                type="primary"
                title="New Translation"
                onClick={handleAdd}
              >
                <PlusOutlined />
              </Button>
            )}
          </Col>
        </Row>
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableProvider = ({
  form,
  columns,
  data,
  isEditing,
  handleShowAllTranslations,
  handleAdd,
  cancel,
}) => {
  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const tableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <TranslationAddButtons
          handleTranslationClick={handleShowAllTranslations}
          handleAddClick={handleAdd}
        />
        <Table
          components={components}
          bordered
          dataSource={data}
          rowKey={(datum) => datum.id}
          columns={tableColumns}
          pagination={{
            onChange: cancel,
            defaultPageSize: 25,
          }}
        />
      </EditableContext.Provider>
    </Form>
  );
};
