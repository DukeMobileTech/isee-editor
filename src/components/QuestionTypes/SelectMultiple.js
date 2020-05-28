import React from "react";
import { hasOtherOption, isSelectMultiple } from "../../utils/Utils";
import { Checkbox } from "antd";

export const SelectMultiple = ({ iq }) => {
  if (!isSelectMultiple(iq)) return null;

  return (
    <div>
      {iq.options.map((option, index) => (
        <Checkbox key={option.id}>
          <span
            dangerouslySetInnerHTML={{
              __html: option.text.replace("<p>", "").replace("</p>", "")
            }}
          />
        </Checkbox>
      ))}
      {hasOtherOption(iq) && <Checkbox key={`${iq.id}_other`}>Other</Checkbox>}
    </div>
  );
};
