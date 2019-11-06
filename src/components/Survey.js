import React, { useState } from "react";
import { Tabs, Icon } from "antd";
import Surveys from "./Survey/Surveys";

const { TabPane } = Tabs;

const Survey = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  return (
    <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
      <TabPane
        tab={
          <span>
            <Icon type="container" />
            Survey Responses
          </span>
        }
        key="1"
      >
        <Surveys />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="ordered-list" />
            Device Sync Entries
          </span>
        }
        key="2"
      >
        Device Sync Entries Here
      </TabPane>
    </Tabs>
  );
};

export default Survey;
