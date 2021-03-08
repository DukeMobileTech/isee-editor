import { Alert } from "antd";
import React from "react";

const ErrorAlert = (props) => {
  return (
    <Alert
      message="Error"
      description={props.errors}
      type="error"
      showIcon
      closable
      onClose={() => props.setErrors(null)}
    />
  );
};

export default ErrorAlert;
