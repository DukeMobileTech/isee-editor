import {
  CheckSquareOutlined,
  OrderedListOutlined,
  QuestionOutlined,
  StopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { InstructionContext } from "../context/InstructionContext";
import { OptionContext } from "../context/OptionContext";
import { OptionSetContext } from "../context/OptionSetContext";
import { QuestionSetContext } from "../context/QuestionSetContext";
import { getInstructions } from "../utils/api/instruction";
import { getOptions } from "../utils/api/option";
import { getOptionSets } from "../utils/api/option_set";
import { getQuestionSets } from "../utils/api/question_set";
import Instructions from "./Instruction/Instructions";
import Options from "./Option/Options";
import OptionSets from "./OptionSet/OptionSets";
import Questions from "./Question/Questions";
import QuestionSets from "./QuestionSet/QuestionSets";
import Validations from "./QuestionSet/Validations";

const { TabPane } = Tabs;

const Bank = ({ match, history }) => {
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useContext(OptionContext);

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

  useEffect(() => {
    const fetchOptions = async () => {
      const results = await getOptions();
      setOptions(results.data);
    };
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabSelection = (key) => {
    history.push(`/banks/${key}`);
  };

  const questionSubset = (folder, questionSet) => {
    history.push({
      pathname: "/banks/questions",
      state: { folder, questionSet },
    });
    window.location.reload(false);
  };

  return (
    <Tabs defaultActiveKey={match.params.tab} onChange={onTabSelection}>
      <TabPane
        tab={
          <span>
            <OrderedListOutlined />
            Question Sets
          </span>
        }
        key="question_sets"
      >
        <QuestionSets questionSubset={questionSubset} />
      </TabPane>
      <TabPane
        tab={
          <span>
            <QuestionOutlined />
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
            <OrderedListOutlined />
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
            <UnorderedListOutlined />
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
            <StopOutlined />
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
            <CheckSquareOutlined />
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
