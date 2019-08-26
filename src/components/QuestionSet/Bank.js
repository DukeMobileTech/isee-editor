import React, { useState } from "react";
import { Tabs, Icon } from "antd";
import QuestionSets from "./QuestionSets";
import OptionSets from "./OptionSets";
import Instructions from "./Instructions";
import Validations from "./Validations";

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
        <QuestionSets />
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
            <Icon type="stop" />
            Instructions
          </span>
        }
        key="3"
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
        key="4"
      >
        <Validations />
      </TabPane>
    </Tabs>
  );
};

export default Bank;
