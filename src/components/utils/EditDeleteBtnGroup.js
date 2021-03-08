import { Divider } from "antd";
import React, { Fragment } from "react";
import { DeleteButton, EditButton } from "../../utils/Buttons";

export const EditDeleteBtnGroup = (props) => (
  <Fragment>
    <EditButton
      handleClick={(event) => {
        event.stopPropagation();
        props.handleEdit(props.object);
      }}
    />
    <Divider type="vertical" />
    <DeleteButton
      handleClick={(event) => {
        event.stopPropagation();
        // eslint-disable-next-line no-alert
        if (window.confirm(`Are you sure you want to delete ${props.message}?`))
          props.handleDelete(props.object);
      }}
    />
  </Fragment>
);
