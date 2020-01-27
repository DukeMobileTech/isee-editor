import React from "react";
import { Alert } from "antd";

const ErrorAlert = props => {
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
