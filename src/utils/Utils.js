import React, { Fragment } from "react";
import { ErrorMessage } from "formik";
import { Alert, Button, Col, Icon, Divider, Row } from "antd";

export const AlertErrorMessage = props => {
  return (
    <ErrorMessage
      name={props.name}
      render={msg => <Alert message={msg} type={props.type} />}
    />
  );
};

export const CenteredSubmitButton = props => {
  return (
    <div className="ant-col ant-form-item-control-wrapper ant-col-sm-16 ant-col-sm-offset-8">
      <Button type="primary" htmlType="submit">
        {props.text}
      </Button>
    </div>
  );
};

export const RightSubmitButton = () => {
  return (
    <Col offset={22}>
      <Button type="primary" htmlType="submit">
        <Icon type="save" />
      </Button>
    </Col>
  );
};

export const RightSaveButton = props => {
  return (
    <Col offset={22}>
      <Button type="primary" onClick={props.handleClick}>
        <Icon type="save" />
      </Button>
    </Col>
  );
};

export const LeftCancelButton = props => {
  return (
    <Col span={2}>
      <Button onClick={props.handleClick}>
        <Icon type="rollback" />
      </Button>
    </Col>
  );
};

export const FolderAddButton = props => {
  return (
    <Col offset={22}>
      <Button type="primary" onClick={props.handleClick}>
        <Icon type="folder-add" />
      </Button>
    </Col>
  );
};

export const AddButton = props => {
  return (
    <Col offset={22}>
      <Button type="primary" onClick={props.handleClick}>
        <Icon type="plus" />
      </Button>
    </Col>
  );
};

export const EditButton = props => {
  return (
    <Button type="primary" onClick={props.handleClick}>
      <Icon type="edit" />
    </Button>
  );
};

export const DeleteButton = props => {
  return (
    <Button type="danger" onClick={props.handleClick}>
      <Icon type="delete" />
    </Button>
  );
};

export const ViewButton = props => {
  return (
    <Button type="primary" onClick={props.handleClick}>
      <Icon type="folder-open" />
    </Button>
  );
};

export const EditDeleteBtnGroup = props => (
  <Fragment>
    <EditButton
      handleClick={event => {
        event.stopPropagation();
        props.handleEdit(props.object);
      }}
    />
    <Divider type="vertical" />
    <DeleteButton
      handleClick={event => {
        event.stopPropagation();
        if (window.confirm(`Are you sure you want to delete ${props.message}?`))
          props.handleDelete(props.object);
      }}
    />
  </Fragment>
);

export const DRow = ({ children }) => {
  return (
    <Row gutter={8} style={{ marginBottom: 8 }}>
      {children}
    </Row>
  );
};

export const questionTypesWithOptions = [
  "SELECT_ONE",
  "SELECT_MULTIPLE",
  "SELECT_ONE_WRITE_OTHER",
  "SELECT_MULTIPLE_WRITE_OTHER",
  "LIST_OF_TEXT_BOXES",
  "LIST_OF_INTEGER_BOXES",
  "LABELED_SLIDER",
  "DROP_DOWN"
];
