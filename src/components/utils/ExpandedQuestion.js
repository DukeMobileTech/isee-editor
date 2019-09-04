import React from "react";
import { Tag, Typography } from "antd";
const { Text } = Typography;

const ExpandedQuestion = ({ question }) => {
  return (
    <span>
      {question.instructions && (
        <p style={{ margin: 1 }}>
          <Text strong>Instructions: </Text>
          <span
            dangerouslySetInnerHTML={{
              __html: question.instructions
            }}
          />
        </p>
      )}
      {question.options.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Options: </Text>
          {question.options.map((option, index) => (
            <Text code key={option.id}>{`${index + 1}) ${option.text}`}</Text>
          ))}
        </p>
      )}
      {question.special_options.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Special Options: </Text>
          {question.special_options.map((option, index) => (
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
