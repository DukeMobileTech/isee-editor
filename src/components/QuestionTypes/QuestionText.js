import { Typography } from "antd";
import React from "react";

export const QuestionText = ({ iq }) => {
  return (
    <div>
      {iq.before_text_instruction && (
        <Typography.Paragraph>
          <i>
            <span
              dangerouslySetInnerHTML={{
                __html: iq.before_text_instruction,
              }}
            />
          </i>
        </Typography.Paragraph>
      )}
      <Typography.Paragraph>
        <span
          dangerouslySetInnerHTML={{
            __html: iq.text,
          }}
        />
      </Typography.Paragraph>
      {iq.after_text_instruction && (
        <Typography.Paragraph>
          <i>
            <span
              dangerouslySetInnerHTML={{
                __html: iq.after_text_instruction,
              }}
            />
          </i>
        </Typography.Paragraph>
      )}
      {iq.pop_up_instruction_text && (
        <Typography.Paragraph>
          <i>
            <span
              dangerouslySetInnerHTML={{
                __html: iq.pop_up_instruction_text,
              }}
            />
          </i>
        </Typography.Paragraph>
      )}
    </div>
  );
};
