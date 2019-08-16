import React from "react";
import { ErrorMessage } from "formik";
import { Alert, Button, Col, Icon } from "antd";

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
    <Col offset={23}>
      <Button type="primary" htmlType="submit">
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

export const RightAddButton = props => {
  return (
    <Col offset={23}>
      <Button type="primary" onClick={props.handleClick}>
        <Icon type="folder-add" />
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
