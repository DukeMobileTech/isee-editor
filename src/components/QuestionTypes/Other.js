import React from "react";
import { isOther } from "../../utils/Utils";
import { Input } from "antd";

export const Other = ({ iq }) => {
  if (!isOther(iq)) return null;

  return <Input.TextArea rows={2} />;
};
