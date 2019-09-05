import React, { useState } from "react";
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

const Bank = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  return (
    <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
      <TabPane
        tab={
          <span>
            <Icon type="question" />
            Question Sets
          </span>
        }
        key="1"
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
        key="2"
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
        key="3"
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
        key="4"
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
        key="5"
      >
        <Validations />
      </TabPane>
    </Tabs>
  );
};

export default Bank;
