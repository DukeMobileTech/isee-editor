import React, { useContext, useEffect } from "react";
import { Tabs, Icon } from "antd";
import QuestionSets from "./QuestionSet/QuestionSets";
import OptionSets from "./OptionSet/OptionSets";
import Validations from "./QuestionSet/Validations";
import Instructions from "./Instruction/Instructions";
import { QuestionSetContext } from "../context/QuestionSetContext";
import Options from "./Option/Options";
import Questions from "./Question/Questions";
import { getQuestionSets } from "../utils/api/question_set";
import { getInstructions } from "../utils/api/instruction";
import { getOptionSets } from "../utils/api/option_set";
import { OptionSetContext } from "../context/OptionSetContext";
import { InstructionContext } from "../context/InstructionContext";

const { TabPane } = Tabs;

const Bank = ({ match, history }) => {
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      const results = await getQuestionSets();
      setQuestionSets(results.data);
    };
    fetchQuestionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchOptionSets = async () => {
      const results = await getOptionSets();
      setOptionSets(results.data);
    };
    fetchOptionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchInstructions = async () => {
      const results = await getInstructions();
      setInstructions(results.data);
    };
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabSelection = key => {
    history.push(`/banks/${key}`);
  };

  return (
    <Tabs defaultActiveKey={match.params.tab} onChange={onTabSelection}>
      <TabPane
        tab={
          <span>
            <Icon type="ordered-list" />
            Question Sets
          </span>
        }
        key="question_sets"
      >
        <QuestionSets />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="question" />
            Questions
          </span>
        }
        key="questions"
      >
        <Questions />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="ordered-list" />
            Option Sets
          </span>
        }
        key="option_sets"
      >
        <OptionSets />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="unordered-list" />
            Options
          </span>
        }
        key="options"
      >
        <Options />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="stop" />
            Instructions
          </span>
        }
        key="instructions"
      >
        <Instructions />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="check-square" />
            Validations
          </span>
        }
        key="validations"
      >
        <Validations />
      </TabPane>
    </Tabs>
  );
};

export default Bank;
