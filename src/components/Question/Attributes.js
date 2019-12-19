import { Tag, Typography, Row, Col } from "antd";

import React, { useState, useContext, Fragment } from "react";
import { InstructionContext } from "../../context/InstructionContext";
const { Text } = Typography;

const Attributes = ({ question }) => {
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [specialOptions, setSpecialOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);

  return (
    <Fragment>
      <Row>
        <Col span={6}>
          <Typography.Text strong>Type:</Typography.Text>
        </Col>
        <Col span={18}>{question.question_type}</Col>
      </Row>
      {question.instruction_id && (
        <Row>
          <Col span={6}>
            <Typography.Text strong>Instructions: {} </Typography.Text>
          </Col>
          <Col span={18}>
            <span
              dangerouslySetInnerHTML={{
                __html: instructions.find(
                  ins => ins.id === Number(question.instruction_id)
                ).text
              }}
            />
          </Col>
        </Row>
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
