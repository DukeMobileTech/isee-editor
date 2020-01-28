import { Tag, Typography, Button } from "antd";

import React, { useContext, useState } from "react";
import { OptionSetContext } from "../../context/OptionSetContext";
import OptionSetForm from "../OptionSet/OptionSetForm";
import { InstructionContext } from "../../context/InstructionContext";

const { Text } = Typography;

const ExpandedQuestion = ({
  question,
  options,
  specialOptions,
  fetchDisplay
}) => {
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  const [showOptionSet, setShowOptionSet] = useState(false);
  const [optionSet, setOptionSet] = useState(null);
  const questionOptions = options === undefined ? question.options : options;
  const questionSpecialOptions =
    specialOptions === undefined ? question.special_options : specialOptions;

  const handleOptionSetClick = () => {
    setOptionSet(optionSets.find(os => os.id === question.option_set_id));
    setShowOptionSet(true);
  };

  const handleSpecialOptionSetClick = () => {
    setOptionSet(
      optionSets.find(os => os.id === question.special_option_set_id)
    );
    setShowOptionSet(true);
  };

  if (showOptionSet) {
    return (
      <OptionSetForm
        visible={showOptionSet}
        optionSet={optionSet}
        setVisible={setShowOptionSet}
        fetchOptionSet={fetchDisplay}
      />
    );
  } else {
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
        {question.pop_up_instruction_id && (
          <p style={{ margin: 1 }}>
            <Text strong>Pop-up Instructions: </Text>
            <span
              dangerouslySetInnerHTML={{
                __html: instructions.find(
                  instruction =>
                    instruction.id === question.pop_up_instruction_id
                ).text
              }}
            />
          </p>
        )}
        {question.after_text_instruction_id && (
          <p style={{ margin: 1 }}>
            <Text strong>After Text Instructions: </Text>
            <span
              dangerouslySetInnerHTML={{
                __html: instructions.find(
                  instruction =>
                    instruction.id === question.after_text_instruction_id
                ).text
              }}
            />
          </p>
        )}
        {questionOptions.length > 0 && (
          <p style={{ margin: 1 }}>
            <Button
              title="Edit Options"
              type="link"
              onClick={handleOptionSetClick}
            >
              Options
            </Button>
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
            <Button
              title="Edit Special Options"
              type="link"
              onClick={handleSpecialOptionSetClick}
            >
              Special Options
            </Button>
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
  }
};

export default ExpandedQuestion;
