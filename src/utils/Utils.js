import { Alert, Icon, Row } from "antd";

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
