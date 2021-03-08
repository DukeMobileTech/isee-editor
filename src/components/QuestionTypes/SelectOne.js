import { Radio } from "antd";
import React from "react";
import { hasOtherOption, isSelectOne } from "../../utils/Utils";

export const SelectOne = ({ iq }) => {
  if (!isSelectOne(iq)) return null;

  return (
    <Radio.Group>
      {iq.options.map((option, index) => (
        <Radio key={option.id} value={index}>
          <span
            dangerouslySetInnerHTML={{
              __html: option.text.replace("<p>", "").replace("</p>", ""),
            }}
          />
        </Radio>
      ))}
      {hasOtherOption(iq) && (
        <Radio key={`${iq.id}_other`} value={iq.options.length + 1}>
          Other
        </Radio>
      )}
    </Radio.Group>
  );
};
