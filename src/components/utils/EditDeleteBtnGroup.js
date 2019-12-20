import { EditButton, DeleteButton } from "../../utils/Buttons";
import React, { Fragment } from "react";
import { Divider } from "antd";

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
