import { Radio } from "antd";
import React from "react";

export const Special = ({ iq }) => {
  if (iq.special_options.length === 0) return null;

  return (
    <Radio.Group>
      {iq.special_options.map((option, index) => (
        <Radio key={option.id} value={option.text}>
          <span
            dangerouslySetInnerHTML={{
              __html: option.text.replace("<p>", "").replace("</p>", ""),
            }}
          />
        </Radio>
      ))}
    </Radio.Group>
  );
};
