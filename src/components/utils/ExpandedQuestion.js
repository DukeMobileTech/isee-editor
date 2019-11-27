import { Tag, Typography } from "antd";

import React from "react";
const { Text } = Typography;

const ExpandedQuestion = ({ question, options, specialOptions }) => {
  const questionOptions = options === undefined ? question.options : options;
  const questionSpecialOptions =
    specialOptions === undefined ? question.special_options : specialOptions;

  return (
    <span>
      {question.instruction && (
        <p style={{ margin: 1 }}>
          <Text strong>Instructions: </Text>
          <span
            dangerouslySetInnerHTML={{
              __html: question.instruction.text
            }}
          />
        </p>
      )}
      {questionOptions.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Options: </Text>
          {questionOptions.map((option, index) => (
            <Text code key={option.id}>{`${index + 1}) ${option.text}`}</Text>
          ))}
        </p>
      )}
      {questionSpecialOptions.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Special Options: </Text>
          {questionSpecialOptions.map((option, index) => (
            <Tag key={option.id}>{`${index + 1}) ${option.text}`}</Tag>
          ))}
        </p>
      )}
      {question.identifies_survey && (
        <p style={{ margin: 1 }}>
          <Text strong>Identifies Survey: </Text>
          {question.identifies_survey.toString()}
        </p>
      )}
    </span>
  );
};

export default ExpandedQuestion;
