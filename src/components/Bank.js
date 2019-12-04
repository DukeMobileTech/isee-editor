import React from "react";
import { Tabs, Icon } from "antd";
import QuestionSets from "./QuestionSet/QuestionSets";
import OptionSets from "./OptionSet/OptionSets";
import Validations from "./QuestionSet/Validations";
import Instructions from "./Instruction/Instructions";
import { OptionSetProvider } from "../context/OptionSetContext";
import { InstructionProvider } from "../context/InstructionContext";
import { QuestionSetProvider } from "../context/QuestionSetContext";
import Options from "./Option/Options";

const { TabPane } = Tabs;

const Bank = ({ match, history }) => {
  const onTabSelection = key => {
    history.push(`/banks/${key}`);
  };

  return (
    <Tabs defaultActiveKey={match.params.tab} onChange={onTabSelection}>
      <TabPane
        tab={
          <span>
            <Icon type="question" />
            Question Sets
          </span>
        }
        key="question_sets"
      >
        <QuestionSetProvider>
          <OptionSetProvider>
            <InstructionProvider>
              <QuestionSets />
            </InstructionProvider>
          </OptionSetProvider>
        </QuestionSetProvider>
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
