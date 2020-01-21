import { Tag, Typography } from "antd";

import React from "react";
const { Text } = Typography;

const ExpandedQuestion = ({ question, options, specialOptions }) => {
  const questionOptions = options === undefined ? question.options : options;
  const questionSpecialOptions =
    specialOptions === undefined ? question.special_options : specialOptions;

  return (
    <span>
      <p style={{ margin: 1 }}>
        <Text strong>Type: </Text>
        <Text>{question.question_type}</Text>
      </p>
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
            <Text code key={option.id}>
              {`${index + 1})`}
              <span
                dangerouslySetInnerHTML={{
                  __html: option.text.replace("<p>", "").replace("</p>", "")
                }}
              />
            </Text>
          ))}
        </p>
      )}
      {questionSpecialOptions.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Special Options: </Text>
          {questionSpecialOptions.map((option, index) => (
            <Tag key={option.id}>
              {`${index + 1})`}
              <span
                dangerouslySetInnerHTML={{
                  __html: option.text.replace("<p>", "").replace("</p>", "")
                }}
              />
            </Tag>
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
