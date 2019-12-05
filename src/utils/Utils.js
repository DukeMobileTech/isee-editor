import { Alert, Button, Col, Icon, Row } from "antd";

import { ErrorMessage } from "formik";
import React from "react";

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
      <Button type="primary" title="Submit" htmlType="submit">
        <Icon type="save" />
      </Button>
    </Col>
  );
};

export const RightSaveButton = props => {
  return (
    <Col offset={22}>
      <Button type="primary" title="Save" onClick={props.handleClick}>
        <Icon type="save" />
      </Button>
    </Col>
  );
};

export const LeftCancelButton = props => {
  return (
    <Col span={2}>
      <Button title="Back" onClick={props.handleClick}>
        <Icon type="rollback" />
      </Button>
    </Col>
  );
};

export const FolderAddButton = props => {
  return (
    <Col offset={22}>
      <Button type="primary" title="New" onClick={props.handleClick}>
        <Icon type="folder-add" />
      </Button>
    </Col>
  );
};

export const AddButton = props => {
  return (
    <Col offset={22}>
      <Button type="primary" title="New" onClick={props.handleClick}>
        <Icon type="plus" />
      </Button>
    </Col>
  );
};

export const EditButton = props => {
  return (
    <Button type="primary" title="Edit" onClick={props.handleClick}>
      <Icon type="edit" />
    </Button>
  );
};

export const DeleteButton = props => {
  return (
    <Button type="danger" title="Delete" onClick={props.handleClick}>
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

export const DRow = ({ children }) => {
  return (
    <Row gutter={8} style={{ marginBottom: 8 }}>
      {children}
    </Row>
  );
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const padding = 5;

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: padding * 2,
  margin: `0 0 ${padding}px 0`,
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgray",
  padding: padding
});

export const customExpandIcon = props => {
  if (props.expanded) {
    return (
      <Icon type="caret-up" onClick={e => props.onExpand(props.record, e)} />
    );
  } else {
    return (
      <Icon type="caret-down" onClick={e => props.onExpand(props.record, e)} />
    );
  }
};
