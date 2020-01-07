import React, { Fragment } from "react";
import ReactQuill from "react-quill";
import {
  Button,
  Divider,
  Form,
  Input,
  Icon,
  Popconfirm,
  Col,
  ConfigProvider,
  Row,
  Table
} from "antd";
import { TranslationButton, TranslationAddButtons } from "../../utils/Buttons";

export const EditableContext = React.createContext();

export const EditableCell = props => {
  const renderCell = ({ getFieldDecorator, setFieldsValue }) => {
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
          dataIndex === "text" ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ],
                initialValue: record[dataIndex]
              })(
                <ReactQuill
                  onChange={value => setFieldsValue({ text: value })}
                />
              )}
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
              })(<Input />)}
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

export const CellActions = ({
  record,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  handleTranslations
}) => {
  const editable = isEditing(record);

  return editable ? (
    <span>
      <EditableContext.Consumer>
        {form => (
          <Button
            type="primary"
            title="Save"
            onClick={() => save(form, record)}
            style={{ margin: 2 }}
          >
            <Icon type="save" />
          </Button>
        )}
      </EditableContext.Consumer>
      <Divider type="vertical" />
      <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record.id)}>
        <Button title="Cancel" style={{ margin: 2 }}>
          <Icon type="undo" />
        </Button>
      </Popconfirm>
    </span>
  ) : (
    <span>
      <Button
        type="primary"
        title="Edit"
        disabled={editingKey !== ""}
        onClick={() => edit(record.id)}
        style={{ margin: 2 }}
      >
        <Icon type="edit" />
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
          <Icon type="delete" />
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
  handleAdd
}) => {
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

  const customizeRenderEmpty = language => {
    if (language) {
      return (
        <p style={{ textAlign: "center" }}>No translations for language</p>
      );
    } else {
      return <p style={{ textAlign: "center" }}>Select Translation Language</p>;
    }
  };

  return (
    <EditableContext.Provider value={form}>
      <Row gutter={8} type="flex" justify="space-between" align="middle">
        <Col span={21}>
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
        <Col span={3}>
          {language && (
            <Button type="primary" title="New Translation" onClick={handleAdd}>
              <Icon type="plus" />
            </Button>
          )}
        </Col>
      </Row>
    </EditableContext.Provider>
  );
};

export const EditableProvider = ({
  form,
  columns,
  data,
  isEditing,
  handleShowAllTranslations,
  handleAdd,
  cancel
}) => {
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

  return (
    <EditableContext.Provider value={form}>
      <TranslationAddButtons
        handleTranslationClick={handleShowAllTranslations}
        handleAddClick={handleAdd}
      />
      <Table
        components={components}
        bordered
        dataSource={data}
        rowKey={datum => datum.id}
        columns={tableColumns}
        pagination={{
          onChange: cancel,
          defaultPageSize: 25
        }}
      />
    </EditableContext.Provider>
  );
};
