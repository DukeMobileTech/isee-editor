import { Button, Col, Icon, Row } from "antd";

import React from "react";

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
        <Icon type="left" />
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

export const LeftCancelRightAddButtons = props => {
  return (
    <Row style={{ margin: "3px" }}>
      <Button title="Back" onClick={props.handleCancelClick}>
        <Icon type="left" />
      </Button>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="New"
        onClick={props.handleAddClick}
      >
        <Icon type="plus" />
      </Button>
    </Row>
  );
};

export const AddButton = props => {
  return (
    <Row style={{ margin: "3px" }}>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="New"
        onClick={props.handleClick}
      >
        <Icon type="plus" />
      </Button>
    </Row>
  );
};

export const TranslationAddButtons = props => {
  return (
    <Row style={{ margin: "3px" }}>
      <Button
        title="Show Translations"
        type="primary"
        onClick={props.handleTranslationClick}
      >
        <Icon type="global" />
      </Button>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="Add New"
        onClick={props.handleAddClick}
      >
        <Icon type="plus" />
      </Button>
    </Row>
  );
};

export const TranslationOrderAddButtons = props => {
  return (
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      style={{ margin: "3px" }}
    >
      <Button
        title="Show Translations"
        type="primary"
        onClick={props.handleTranslationClick}
      >
        <Icon type="global" />
      </Button>
      <Button
        style={{ float: "middle" }}
        type="primary"
        onClick={props.handleReorderClick}
        title="Reorder"
      >
        <Icon type="ordered-list" />
      </Button>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="Add New"
        onClick={props.handleAddClick}
      >
        <Icon type="plus" />
      </Button>
    </Row>
  );
};

export const EditButton = props => {
  return (
    <Button
      style={{ margin: "1px" }}
      type="primary"
      title="Edit"
      onClick={props.handleClick}
    >
      <Icon type="edit" />
    </Button>
  );
};

export const DeleteButton = props => {
  return (
    <Button
      style={{ margin: "1px" }}
      type="danger"
      title="Delete"
      onClick={props.handleClick}
    >
      <Icon type="delete" />
    </Button>
  );
};

export const ViewButton = props => {
  return (
    <Button
      style={{ margin: "1px" }}
      type="primary"
      title="Show"
      onClick={props.handleClick}
    >
      <Icon type="folder-open" />
    </Button>
  );
};

export const TranslationButton = props => {
  return (
    <Button type="primary" title="Translations" onClick={props.handleClick}>
      <Icon type="global" />
    </Button>
  );
};

export const CopyButton = props => {
  return (
    <Button type="primary" title="Copy" onClick={props.handleClick}>
      <Icon type="copy" />
    </Button>
  );
};
