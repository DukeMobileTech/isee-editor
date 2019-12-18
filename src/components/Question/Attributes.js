import { Tag, Typography } from "antd";

import React, { useState, useContext, Fragment } from "react";
import { InstructionContext } from "../../context/InstructionContext";
const { Text } = Typography;

const Attributes = ({ question }) => {
  const [options, setOptions] = useState([]);
  const [specialOptions, setSpecialOptions] = useState([]);
  const [instructions, setInstructions] = useContext(InstructionContext);

  return (
    <Fragment>
      <p style={{ margin: 1 }}>
        <Text strong>Type: </Text>
        {question.question_type}
      </p>
      {question.instruction_id && (
        <p style={{ margin: 1 }}>
          <Text strong>Instructions: </Text>
          <span
            dangerouslySetInnerHTML={{
              __html: instructions.find(
                ins => ins.id === Number(question.instruction_id)
              ).text
            }}
          />
        </p>
      )}
      {options.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Options: </Text>
          {options.map((option, index) => (
            <Text code key={option.id}>{`${index + 1}) ${option.text}`}</Text>
          ))}
        </p>
      )}
      {specialOptions.length > 0 && (
        <p style={{ margin: 1 }}>
          <Text strong>Special Options: </Text>
          {specialOptions.map((option, index) => (
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
    </Fragment>
  );
};

export default Attributes;
