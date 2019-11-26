import { Tag, Typography } from "antd";

import React from "react";
const { Text } = Typography;

const ExpandedQuestion = ({ iq }) => {
  return (
    <span>
      {iq.question.instruction && (
        <p style={{ margin: 1 }}>
          <Text strong>Instructions: </Text>
          <span
            dangerouslySetInnerHTML={{
              __html: iq.question.instruction.text
            }}
          />
        </p>
      )}
      {iq.options.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Options: </Text>
          {iq.options.map((option, index) => (
            <Text code key={option.id}>{`${index + 1}) ${option.text}`}</Text>
          ))}
        </p>
      )}
      {iq.special_options.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Special Options: </Text>
          {iq.special_options.map((option, index) => (
            <Tag key={option.id}>{`${index + 1}) ${option.text}`}</Tag>
          ))}
        </p>
      )}
      {iq.question.identifies_survey && (
        <p style={{ margin: 1 }}>
          <Text strong>Identifies Survey: </Text>
          {iq.question.identifies_survey.toString()}
        </p>
      )}
    </span>
  );
};

export default ExpandedQuestion;
