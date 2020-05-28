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

const padding = 3;

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

export const hasNumberResponses = question => {
  return (
    question.question_type === "INTEGER" ||
    question.question_type === "DECIMAL" ||
    question.question_type === "LIST_OF_INTEGER_BOXES"
  );
};

export const hasMultipleResponses = question => {
  return (
    question.question_type === "SELECT_MULTIPLE" ||
    question.question_type === "SELECT_MULTIPLE_WRITE_OTHER" ||
    question.question_type === "LIST_OF_TEXT_BOXES" ||
    question.question_type === "LIST_OF_INTEGER_BOXES"
  );
};

export const hasSingleResponse = question => {
  return (
    question.question_type === "SELECT_ONE" ||
    question.question_type === "SELECT_ONE_WRITE_OTHER" ||
    question.question_type === "DROP_DOWN"
  );
};

export const hasOtherOption = question => {
  return (
    question.question_type === "SELECT_ONE_WRITE_OTHER" ||
    question.question_type === "SELECT_MULTIPLE_WRITE_OTHER"
  );
};

export const isDropDown = question => {
  return question.question_type === "DROP_DOWN";
};

export const isSelectOne = question => {
  return (
    question.question_type === "SELECT_ONE" ||
    question.question_type === "SELECT_ONE_WRITE_OTHER"
  );
};

export const isSelectMultiple = question => {
  return (
    question.question_type === "SELECT_MULTIPLE" ||
    question.question_type === "SELECT_MULTIPLE_WRITE_OTHER"
  );
};

export const isInstruction = question => {
  return question.question_type === "INSTRUCTIONS";
};

export const isList = question => {
  return (
    question.question_type === "LIST_OF_TEXT_BOXES" ||
    question.question_type === "LIST_OF_INTEGER_BOXES"
  );
};

export const isOther = question => {
  return (
    question.question_type !== "SELECT_ONE" &&
    question.question_type !== "SELECT_ONE_WRITE_OTHER" &&
    question.question_type !== "DROP_DOWN" &&
    question.question_type !== "INSTRUCTIONS" &&
    question.question_type !== "SELECT_MULTIPLE" &&
    question.question_type !== "SELECT_MULTIPLE_WRITE_OTHER" &&
    question.question_type !== "LIST_OF_TEXT_BOXES" &&
    question.question_type !== "LIST_OF_INTEGER_BOXES"
  );
};
