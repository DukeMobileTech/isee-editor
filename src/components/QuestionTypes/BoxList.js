import { Input } from "antd";
import React from "react";
import { isList } from "../../utils/Utils";

export const BoxList = ({ iq }) => {
  if (!isList(iq)) return null;

  return (
    <div>
      {iq.options.map((option, index) => {
        return (
          <Input
            key={`${option.identifier}_${iq.identifier}`}
            addonBefore={option.text.replace("<p>", "").replace("</p>", "")}
            defaultValue="enter text"
          />
        );
      })}
    </div>
  );
};
