import { Input } from "antd";
import React from "react";
import { isOther } from "../../utils/Utils";

export const Other = ({ iq }) => {
  if (!isOther(iq)) return null;

  return <Input.TextArea rows={2} />;
};
