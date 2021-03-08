import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  LeftOutlined,
  OrderedListOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React from "react";
import { GREEN, WHITE } from "./Colors";

export const RightSubmitButton = () => {
  return (
    <Col offset={22}>
      <Button type="primary" title="Submit" htmlType="submit">
        <SaveOutlined />
      </Button>
    </Col>
  );
};

export const GreenSubmitButton = () => {
  return (
    <Col offset={22}>
      <Button
        style={{ backgroundColor: GREEN }}
        title="Submit"
        htmlType="submit"
      >
        <SaveOutlined style={{ color: WHITE }} />
      </Button>
    </Col>
  );
};

export const RightSaveButton = (props) => {
  return (
    <Col offset={22}>
      <Button type="primary" title="Save" onClick={props.handleClick}>
        <SaveOutlined />
      </Button>
    </Col>
  );
};

export const LeftCancelButton = (props) => {
  return (
    <Col span={2}>
      <Button title="Back" onClick={props.handleClick}>
        <LeftOutlined />
      </Button>
    </Col>
  );
};

export const FolderAddButton = (props) => {
  return (
    <Col offset={22}>
      <Button type="primary" title="New" onClick={props.handleClick}>
        <FolderAddOutlined />
      </Button>
    </Col>
  );
};

export const LeftCancelRightAddButtons = (props) => {
  return (
    <Row style={{ margin: "3px" }}>
      <Button title="Back" onClick={props.handleCancelClick}>
        <LeftOutlined />
      </Button>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="New"
        onClick={props.handleAddClick}
      >
        <PlusOutlined />
      </Button>
    </Row>
  );
};

export const AddButton = (props) => {
  return (
    <Row style={{ margin: "3px" }}>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="New"
        onClick={props.handleClick}
      >
        <PlusOutlined />
      </Button>
    </Row>
  );
};

export const TranslationAddButtons = (props) => {
  return (
    <Row
      gutter={8}
      type="flex"
      justify="space-between"
      style={{ margin: "3px" }}
    >
      <Button
        title="Show Translations"
        type="primary"
        onClick={props.handleTranslationClick}
      >
        <GlobalOutlined />
      </Button>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="Add New"
        onClick={props.handleAddClick}
      >
        <PlusOutlined />
      </Button>
    </Row>
  );
};

export const TranslationOrderAddButtons = (props) => {
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
        <GlobalOutlined />
      </Button>
      <Button
        style={{ float: "middle" }}
        type="primary"
        onClick={props.handleReorderClick}
        title="Reorder"
      >
        <OrderedListOutlined />
      </Button>
      <Button
        style={{ float: "right" }}
        type="primary"
        title="Add New"
        onClick={props.handleAddClick}
      >
        <PlusOutlined />
      </Button>
    </Row>
  );
};

export const SaveButton = (props) => {
  return (
    <Button
      style={{ margin: "1px", backgroundColor: GREEN }}
      type="primary"
      title="Save"
      onClick={props.handleClick}
    >
      <SaveOutlined />
    </Button>
  );
};

export const EditButton = (props) => {
  return (
    <Button
      style={{ margin: "1px" }}
      type="primary"
      title="Edit"
      onClick={props.handleClick}
    >
      <EditOutlined />
    </Button>
  );
};

export const DeleteButton = (props) => {
  return (
    <Button
      style={{ margin: "1px" }}
      type="danger"
      title="Delete"
      onClick={props.handleClick}
    >
      <DeleteOutlined />
    </Button>
  );
};

export const ViewButton = (props) => {
  return (
    <Button
      style={{ margin: "1px" }}
      type="primary"
      title="Show"
      onClick={props.handleClick}
    >
      <FolderOpenOutlined />
    </Button>
  );
};

export const TranslationButton = (props) => {
  return (
    <Button type="primary" title="Translations" onClick={props.handleClick}>
      <GlobalOutlined />
    </Button>
  );
};

export const CopyButton = (props) => {
  return (
    <Button type="primary" title="Copy" onClick={props.handleClick}>
      <CopyOutlined />
    </Button>
  );
};
